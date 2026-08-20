import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const read = (path) => readFile(new URL(path, import.meta.url), 'utf8');

test('API keys are memory-only and custom model persistence is sanitized', async () => {
  const source = await read('public/static/app.js');
  assert.doesNotMatch(source, /API_KEYS:\s*'aiteam_api_keys'/);
  assert.doesNotMatch(source, /function (?:encodeKey|decodeKey)|\bbtoa\(|\batob\(/);
  assert.match(source, /state\.customModels\.map\(withoutApiKey\)/);
  assert.match(source, /LEGACY_SECRET_STORAGE_KEYS\.forEach\(key => localStorage\.removeItem\(key\)\)/);
});

test('public outbound endpoints are default-off', async () => {
  const backend = await read('src/index.tsx');
  const routes = ['/api/proxy/:provider', '/api/search', '/api/fetch-url', '/api/gpts/list'];
  for (const route of routes) {
    const start = backend.indexOf(`app.post('${route}'`);
    const fetchAt = backend.indexOf('fetch(', start);
    const gateAt = backend.indexOf("ENABLE_PUBLIC_UPSTREAM_PROXY !== 'true'", start);
    assert.notEqual(start, -1, `${route} exists`);
    assert.ok(gateAt > start && (fetchAt === -1 || gateAt < fetchAt), `${route} is gated before fetch`);
  }

  const wrangler = await read('wrangler.jsonc');
  assert.match(wrangler, /"ENABLE_PUBLIC_UPSTREAM_PROXY": "false"/);
});
