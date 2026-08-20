import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const read = (path) => readFile(new URL(path, import.meta.url), 'utf8');

test('API keys are memory-only and custom model persistence is sanitized', async () => {
  const source = await read('public/static/app.js');
  assert.doesNotMatch(source, /API_KEYS:\s*'aiteam_api_keys'/);
  assert.doesNotMatch(source, /function (?:encodeKey|decodeKey)|\bbtoa\(|\batob\(/);
  assert.match(source, /state\.customModels\.map\(withoutApiKey\)/);
  assert.match(source, /function clearPersistedSecrets\(\)/);
  assert.match(source, /clearPersistedSecrets\(\);/);
  assert.ok(
    source.indexOf('clearPersistedSecrets();') < source.indexOf('JSON.parse(channels)'),
    'secret migration runs before parsing unrelated caches',
  );
});

test('corrupt non-secret cache cannot block legacy key cleanup', async () => {
  const source = await read('public/static/app.js');
  const clearStart = source.indexOf('function clearPersistedSecrets()');
  const clearEnd = source.indexOf('\n\n  // Complete AI Models', clearStart);
  const loadStart = source.indexOf('function loadState()');
  const loadEnd = source.indexOf('\n\n  function saveState()', loadStart);
  assert.ok(clearStart > -1 && clearEnd > clearStart && loadStart > -1 && loadEnd > loadStart);

  const data = new Map([
    ['aiteam_api_keys', 'legacy-provider-key'],
    ['aiteam_search_key', 'legacy-search-key'],
    ['aiteam_channels', '{broken-json'],
    ['aiteam_custom_models', JSON.stringify([{ id: 'custom', apiKey: 'legacy-custom-key' }])],
  ]);
  const localStorage = {
    getItem: key => data.get(key) ?? null,
    setItem: (key, value) => data.set(key, value),
    removeItem: key => data.delete(key),
  };
  const exercise = new Function(
    'localStorage',
    'testConsole',
    `
      const STORAGE_KEYS = {
        CHANNELS: 'aiteam_channels', MESSAGES: 'aiteam_messages', GPTS: 'aiteam_gpts',
        IMPORTED_CONTENT: 'aiteam_imported', CUSTOM_MODELS: 'aiteam_custom_models',
        CURRENT_CHANNEL: 'aiteam_current_channel'
      };
      const LEGACY_SECRET_STORAGE_KEYS = ['aiteam_api_keys', 'aiteam_search_key'];
      const withoutApiKey = model => { const { apiKey, ...safeModel } = model; return safeModel; };
      let state = { channels: [], messages: {}, gpts: [], importedContent: [], customModels: [], currentChannel: 'general' };
      const console = testConsole;
      ${source.slice(clearStart, clearEnd)}
      ${source.slice(loadStart, loadEnd)}
      loadState();
      return state;
    `,
  );

  const state = exercise(localStorage, { error() {} });
  assert.equal(data.has('aiteam_api_keys'), false);
  assert.equal(data.has('aiteam_search_key'), false);
  assert.deepEqual(JSON.parse(data.get('aiteam_custom_models')), [{ id: 'custom' }]);
  assert.deepEqual(state.customModels, [{ id: 'custom' }]);
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
