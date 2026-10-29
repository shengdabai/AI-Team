import assert from 'node:assert/strict';
import test, { afterEach, beforeEach } from 'node:test';
import { build } from 'esbuild';
import { allowedFetchUrl, readLimitedText } from './src/proxy-security.ts';

// Bundle the real route tree in memory. No server, account, disk credential,
// real upstream request, or deployment is involved in these tests.
const bundle = await build({ entryPoints: ['src/index.tsx'], bundle: true, write: false,
  format: 'esm', platform: 'node' });
const { default: app } = await import(`data:text/javascript;base64,${Buffer.from(bundle.outputFiles[0].text).toString('base64')}`);
const issuer = 'https://fixture.cloudflareaccess.com';
const pair = await crypto.subtle.generateKey({ name: 'RSASSA-PKCS1-v1_5',
  modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' }, true, ['sign', 'verify']);
const jwk = { ...await crypto.subtle.exportKey('jwk', pair.publicKey), kid: 'fixture', alg: 'RS256' };
const encode = value => Buffer.from(JSON.stringify(value)).toString('base64url');
async function token(changes = {}, header = {}) {
  const now = Math.floor(Date.now() / 1000);
  const data = `${encode({ alg: 'RS256', kid: 'fixture', ...header })}.${encode({
    iss: issuer, aud: ['fixture-audience'], sub: 'fixture-user', iat: now - 1, exp: now + 300, ...changes,
  })}`;
  const signature = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', pair.privateKey, Buffer.from(data));
  return `${data}.${Buffer.from(signature).toString('base64url')}`;
}
const validToken = await token();
const env = () => ({ ENABLE_PUBLIC_UPSTREAM_PROXY: 'true', ACCESS_TEAM_DOMAIN: issuer,
  ACCESS_AUD: 'fixture-audience', PROXY_RATE_LIMITER: { limit: async () => ({ success: true }) },
  FETCH_ALLOWED_HOSTS: 'example.com' });
const originalFetch = globalThis.fetch;
beforeEach(() => { globalThis.fetch = async () => assert.fail('unexpected network request'); });
afterEach(() => { globalThis.fetch = originalFetch; });
function mockUpstream(handler = () => assert.fail('unexpected upstream request')) {
  globalThis.fetch = async (url, init) => {
    assert.equal(init.redirect, 'manual');
    assert.ok(init.signal instanceof AbortSignal);
    if (String(url) === `${issuer}/cdn-cgi/access/certs`) return Response.json({ keys: [jwk] });
    return handler(String(url), init);
  };
}
function request(path, options = {}) {
  return app.request(path, { method: 'POST', body: options.body ?? '{}', headers: {
    'Content-Type': 'application/json', 'Cf-Access-Jwt-Assertion': options.token ?? validToken,
    'X-API-Key': 'fixture-provider-key', 'X-Search-Key': 'fixture-search-key', ...options.headers,
  } }, options.env ?? env());
}

for (const path of ['/api/proxy/openai', '/api/search', '/api/fetch-url', '/api/gpts/list']) {
  test(`${path} rejects disabled, misconfigured, and unauthenticated access without fetching`, async () => {
    assert.equal((await request(path, { env: {} })).status, 404);
    assert.equal((await request(path, { env: { ENABLE_PUBLIC_UPSTREAM_PROXY: 'true' } })).status, 503);
    assert.equal((await request(path, { env: { ...env(), ACCESS_TEAM_DOMAIN: 'https://example.com' } })).status, 503);
    const response = await request(path, { token: '' });
    assert.equal(response.status, 401);
    assert.equal(response.headers.get('Cache-Control'), 'no-store');
  });
}
for (const [name, changes, header] of [
  ['wrong issuer', { iss: 'https://other.cloudflareaccess.com' }],
  ['wrong audience', { aud: ['other-audience'] }], ['expired', { exp: 1 }],
  ['missing expiry', { exp: undefined }], ['missing issue time', { iat: undefined }],
  ['future issue time', { iat: 9999999999 }], ['future not-before', { nbf: 9999999999 }],
  ['missing subject', { sub: '' }], ['unknown signing key', {}, { kid: 'other' }],
  ['wrong algorithm', {}, { alg: 'HS256' }],
]) {
  test(`identity validation rejects ${name} before rate limiting or forwarding`, async () => {
    mockUpstream();
    const bindings = env();
    bindings.PROXY_RATE_LIMITER.limit = () => assert.fail('invalid identities must not reach limiter');
    assert.equal((await request('/api/gpts/list', { token: await token(changes, header), env: bindings })).status, 401);
  });
}
test('a tampered signed identity is rejected', async () => {
  mockUpstream();
  const parts = validToken.split('.');
  parts[1] = encode({ iss: issuer, aud: ['fixture-audience'], sub: 'attacker', exp: 9999999999, iat: 1 });
  assert.equal((await request('/api/gpts/list', { token: parts.join('.') })).status, 401);
});
test('identity service failures deny access without returning private diagnostics', async () => {
  const response = await request('/api/gpts/list');
  assert.equal(response.status, 401);
  assert.equal((await response.json()).error, 'Invalid or expired identity');
});
test('verified subject shares the limiter across endpoints; exhausted and failed limiters deny requests', async () => {
  mockUpstream();
  const bindings = env();
  const keys = [];
  bindings.PROXY_RATE_LIMITER.limit = async input => { keys.push(input.key); return { success: false }; };
  for (const path of ['/api/search', '/api/proxy/openai', '/api/gpts/list', '/api/fetch-url']) {
    assert.equal((await request(path, { env: bindings, headers: { 'Cf-Connecting-Ip': 'forged' } })).status, 429);
  }
  assert.deepEqual(keys, Array(4).fill('proxy:fixture-user'));
  bindings.PROXY_RATE_LIMITER.limit = async () => { throw new Error('private diagnostic'); };
  const response = await request('/api/search', { env: bindings });
  assert.equal(response.status, 503);
  assert.doesNotMatch(await response.text(), /private diagnostic/);
});
test('valid identity forwards only to the fixed provider endpoint', async () => {
  mockUpstream((url, init) => {
    assert.equal(url, 'https://api.openai.com/v1/chat/completions');
    assert.equal(JSON.parse(init.body).model, 'gpt-4o');
    return Response.json({ choices: [{ message: { content: 'fixture response' } }] });
  });
  const response = await request('/api/proxy/openai', { body: JSON.stringify({
    model: 'gpt-4o', messages: [{ role: 'user', content: 'fixture prompt' }],
  }) });
  assert.equal(response.status, 200);
  assert.equal((await response.json()).choices[0].message.content, 'fixture response');
});
test('search rejects malformed and invalid payloads; upstream failures do not leak details', async () => {
  mockUpstream();
  for (const body of ['{', 'null', '{}', '{"query":42}', '{"query":" "}']) {
    assert.equal((await request('/api/search', { body })).status, 400);
  }
  mockUpstream(() => { throw new Error('fixture-sensitive-diagnostic'); });
  const response = await request('/api/search', { body: '{"query":"test"}' });
  assert.equal(response.status, 502);
  assert.doesNotMatch(await response.text(), /fixture-sensitive/);
});
for (const path of ['/api/search', '/api/gpts/list']) {
  test(`${path} does not expose upstream rejection bodies or exception messages`, async () => {
    for (const throws of [false, true]) {
      mockUpstream(() => {
        if (throws) throw new Error('fixture-sensitive-diagnostic');
        return Response.json({ error: 'fixture-sensitive-diagnostic' }, { status: 401 });
      });
      const response = await request(path, { body: '{"query":"test"}' });
      assert.equal(response.status, 502);
      assert.doesNotMatch(await response.text(), /fixture-sensitive/);
    }
  });
}
test('request body limit rejects excessive input before the handler can forward it', async () => {
  mockUpstream();
  const response = await request('/api/search', { body: 'x'.repeat(8 * 1024 * 1024 + 1) });
  assert.equal(response.status, 413);
});
test('fetch URL accepts only exact explicitly allowed HTTPS hostnames', () => {
  assert.equal(allowedFetchUrl('https://EXAMPLE.com/path', 'example.com').href, 'https://example.com/path');
  for (const value of ['http://example.com', 'https://sub.example.com', 'https://example.com.attacker.com',
    'https://user:pass@example.com', 'https://example.com:444', 'https://127.1', 'https://[::1]',
    'https://[::ffff:7f00:1]', 'https://169.254.169.254', 'https://metadata.internal', 'file:///test']) {
    assert.equal(allowedFetchUrl(value, 'example.com,127.0.0.1,[::1],metadata.internal'), null, value);
  }
  assert.equal(allowedFetchUrl('https://example.com'), null);
});
test('fetch URL validation and content-type filtering prevent unsupported reads', async () => {
  mockUpstream();
  for (const body of ['{', 'null', '{"url":"https://not-allowed.example.com"}']) {
    assert.ok([400, 403].includes((await request('/api/fetch-url', { body })).status));
  }
  mockUpstream(() => new Response('pdf fixture', { headers: { 'Content-Type': 'application/pdf' } }));
  assert.equal((await request('/api/fetch-url', { body: '{"url":"https://example.com"}' })).status, 415);
  mockUpstream(() => new Response('<p>fixture text</p>', { headers: { 'Content-Type': 'text/html' } }));
  const response = await request('/api/fetch-url', { body: '{"url":"https://example.com"}' });
  assert.equal((await response.json()).content, 'fixture text');
});
test('bounded response reader handles UTF-8 split across chunks and cancels oversized streams', async () => {
  const bytes = new TextEncoder().encode('中文');
  assert.equal(await readLimitedText(new Response(new ReadableStream({ start(controller) {
    controller.enqueue(bytes.slice(0, 2)); controller.enqueue(bytes.slice(2)); controller.close();
  } }))), '中文');
  let cancelled = false;
  const response = new Response(new ReadableStream({
    start(controller) { controller.enqueue(new Uint8Array(11)); }, cancel() { cancelled = true; },
  }));
  await assert.rejects(readLimitedText(response, 10), /too large/);
  assert.equal(cancelled, true);
});

test('Pages RPC limiter adapter forwards valid subjects and denies HTTP or invalid keys', async () => {
  const worker = await build({ entryPoints: ['src/limiter-worker.ts'], bundle: true, write: false,
    format: 'esm', platform: 'node', plugins: [{ name: 'mock-runtime', setup(builder) {
      builder.onResolve({ filter: /^cloudflare:workers$/ }, () => ({ path: 'runtime', namespace: 'mock' }));
      builder.onLoad({ filter: /.*/, namespace: 'mock' }, () => ({ contents:
        'export class WorkerEntrypoint { constructor(env) { this.env = env; } }' }));
    } }] });
  const { default: Limiter } = await import(`data:text/javascript;base64,${Buffer.from(worker.outputFiles[0].text).toString('base64')}`);
  const keys = [];
  const limiter = new Limiter({ PROXY_REQUESTS: { limit: async input => {
    keys.push(input.key); return { success: keys.length === 1 };
  } } });
  assert.deepEqual(await limiter.limit({ key: 'proxy:fixture-user' }), { success: true });
  assert.deepEqual(await limiter.limit({ key: 'proxy:fixture-user' }), { success: false });
  for (const key of ['', 'proxy:', 'unverified', 'proxy:' + 'x'.repeat(257)]) {
    assert.deepEqual(await limiter.limit({ key }), { success: false });
  }
  assert.deepEqual(keys, ['proxy:fixture-user', 'proxy:fixture-user']);
  assert.equal((await limiter.fetch()).status, 404);
  await assert.rejects(new Limiter({}).limit({ key: 'proxy:fixture-user' }));
});
