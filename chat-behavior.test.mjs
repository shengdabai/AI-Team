import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import vm from 'node:vm';

const source = await readFile(new URL('public/static/app.js', import.meta.url), 'utf8');

// Exercise the actual application closure without booting a browser or calling an API.
function appHarness(fetch) {
  const input = { value: '', style: {}, focus() {} };
  const context = vm.createContext({
    console: { error() {} },
    fetch,
    setTimeout: callback => callback(),
    localStorage: { setItem() {} },
    document: {
      getElementById: id => id === 'messageInput' ? input : null,
      createElement: () => ({
        textContent: '',
        get innerHTML() {
          return String(this.textContent).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
        },
      }),
    },
  });
  const start = source.indexOf('  // Start the app');
  assert.ok(start > 0);
  vm.runInContext(source.slice(0, start) + `
    showToast = () => {};
    globalThis.app = { state, sendMessage, runMeetingMode, renderModels, showMentions,
      escapeHtml, renderMessage, renderChannels, renderGpts, renderImportedContent, showTypingIndicator };
  })();`, context);
  return { ...context.app, input, document: context.document };
}

const response = text => ({ json: async () => ({ choices: [{ message: { content: text } }] }) });

for (const failure of [false, true]) {
  test(`in-flight ${failure ? 'error' : 'reply'} stays in the originating channel`, async () => {
    let complete;
    const app = appHarness(() => new Promise((resolve, reject) => {
      complete = () => failure ? reject(new Error('offline')) : resolve(response('answer'));
    }));
    app.state.apiKeys.openaiKey = 'test-only';
    app.state.messages.other = [];
    app.input.value = '@gpt-4o question';
    const pending = app.sendMessage();
    app.state.currentChannel = 'other';
    complete();
    await pending;
    assert.equal(app.state.messages.other.length, 0);
    assert.equal(app.state.messages.general.length, 2);
    assert.match(app.state.messages.general[1].content, failure ? /offline/ : /answer/);
  });
}

test('later participants use the originating history after switching channels', async () => {
  const requests = [];
  let complete;
  const app = appHarness((url, options) => {
    requests.push({ url, body: JSON.parse(options.body) });
    if (requests.length === 1) return new Promise(resolve => { complete = () => resolve(response('first')); });
    return Promise.resolve(response('second'));
  });
  app.state.apiKeys.openaiKey = 'test-only';
  app.state.messages.other = [{ role: 'user', content: 'unrelated channel' }];
  app.input.value = '@gpt-4o @gpt-4o-mini original question';
  const pending = app.sendMessage();
  app.state.currentChannel = 'other';
  complete();
  await pending;
  assert.equal(requests.length, 2);
  assert.match(requests[1].body.messages[0].content, /original question/);
  assert.doesNotMatch(JSON.stringify(requests[1]), /unrelated channel/);
  assert.equal(app.state.messages.general.length, 3);
  assert.equal(app.state.messages.other.length, 1);
});

test('clearing the originating history does not resurrect a pending reply elsewhere', async () => {
  let complete;
  const app = appHarness(() => new Promise(resolve => { complete = () => resolve(response('late')); }));
  app.state.apiKeys.openaiKey = 'test-only';
  app.input.value = '@gpt-4o question';
  const pending = app.sendMessage();
  app.state.messages.general = [];
  complete();
  await pending;
  assert.equal(app.state.messages.general.length, 0);
});

test('meeting messages remain in their originating channel across awaited replies', async () => {
  let complete;
  const app = appHarness(() => new Promise(resolve => { complete = () => resolve(response('discussion')); }));
  app.state.apiKeys.openaiKey = 'test-only';
  app.state.meetingRounds = 1;
  app.state.messages.other = [];
  const pending = app.runMeetingMode([{ model: 'gpt-4o', provider: 'openai' }], 'topic');
  app.state.currentChannel = 'other';
  complete();
  await pending;
  assert.equal(app.state.messages.other.length, 0);
  assert.equal(app.state.messages.general.length, 3);
});

test('a full OpenRouter ID including :free reaches the selected provider intact', async () => {
  const requests = [];
  const app = appHarness(async (url, options) => {
    requests.push({ url, body: JSON.parse(options.body) });
    return response('answer');
  });
  app.state.apiKeys.openrouterKey = 'test-only';
  app.input.value = '@google/gemini-2.0-flash-exp:free question';
  await app.sendMessage();
  assert.equal(requests.length, 1);
  assert.equal(requests[0].url, '/api/proxy/openrouter');
  assert.equal(requests[0].body.model, 'google/gemini-2.0-flash-exp:free');
});

test('repeating a model mention makes only one request', async () => {
  let count = 0;
  const app = appHarness(async () => { count++; return response('answer'); });
  app.state.apiKeys.openaiKey = 'test-only';
  app.input.value = '@gpt-4o compare @gpt-4o';
  await app.sendMessage();
  assert.equal(count, 1);
});

test('both model selectors insert the complete provider-qualified model ID', () => {
  const app = appHarness();
  const handlers = {};
  const model = { dataset: { model: 'openai/gpt-4o', provider: 'openrouter' }, addEventListener: (_, fn) => { handlers.model = fn; } };
  const mention = { dataset: model.dataset, addEventListener: (_, fn) => { handlers.mention = fn; } };
  const container = {
    classList: { add() {}, remove() {} },
    querySelectorAll: selector => selector === '.model-item' ? [model] : selector === '.mention-item' ? [mention] : [],
  };
  app.document.getElementById = id => id === 'messageInput' ? app.input : container;
  app.renderModels();
  handlers.model({ stopPropagation() {} });
  assert.equal(app.input.value, '@openai/gpt-4o ');
  app.input.value = '@gpt';
  app.showMentions('gpt');
  handlers.mention();
  assert.equal(app.input.value, '@openai/gpt-4o ');
});

test('a custom participant uses the originating history after a built-in reply', async () => {
  const requests = [];
  let complete;
  const app = appHarness((url, options) => {
    requests.push({ url, body: JSON.parse(options.body) });
    if (requests.length === 1) return new Promise(resolve => { complete = () => resolve(response('first')); });
    return Promise.resolve(response('custom answer'));
  });
  app.state.apiKeys.openaiKey = 'test-only';
  app.state.customModels = [{ mention: 'local-model', endpoint: 'https://example.invalid/chat', modelId: 'local', apiKey: 'test-only' }];
  app.state.messages.other = [{ role: 'user', content: 'unrelated channel' }];
  app.input.value = '@gpt-4o @local-model original question';
  const pending = app.sendMessage();
  app.state.currentChannel = 'other';
  complete();
  await pending;
  assert.equal(requests[1].url, 'https://example.invalid/chat');
  assert.match(requests[1].body.messages[0].content, /original question/);
  assert.doesNotMatch(JSON.stringify(requests[1]), /unrelated channel/);
  assert.equal(app.state.messages.general.at(-1).content, 'custom answer');
  assert.equal(app.state.messages.other.length, 1);
});

test('a meeting started after initial replies retains the send channel', async () => {
  let count = 0;
  let complete;
  const app = appHarness(() => {
    count++;
    if (count === 1) return new Promise(resolve => { complete = () => resolve(response('first')); });
    return Promise.resolve(response('discussion'));
  });
  app.state.apiKeys.openaiKey = 'test-only';
  app.state.meetingMode = true;
  app.state.meetingRounds = 1;
  app.state.messages.other = [];
  app.input.value = '@gpt-4o @gpt-4o-mini topic';
  const pending = app.sendMessage();
  app.state.currentChannel = 'other';
  complete();
  await pending;
  assert.equal(count, 4);
  assert.equal(app.state.messages.other.length, 0);
  assert.equal(app.state.messages.general.length, 7);
  assert.match(app.state.messages.general.at(-1).content, /会议结束/);
});

test('qualified OpenRouter and direct model mentions stay distinct when both have keys', async () => {
  const requests = [];
  const app = appHarness(async (url, options) => {
    requests.push({ url, body: JSON.parse(options.body) });
    return response('answer');
  });
  app.state.apiKeys.openaiKey = 'test-only';
  app.state.apiKeys.openrouterKey = 'test-only';
  app.input.value = '@openai/gpt-4o @gpt-4o compare';
  await app.sendMessage();
  assert.deepEqual(requests.map(r => r.url), ['/api/proxy/openrouter', '/api/proxy/openai']);
  assert.deepEqual(requests.map(r => r.body.model), ['openai/gpt-4o', 'gpt-4o']);
});

test('an ordinary request keeps its attachment and imported context in history', async () => {
  const requests = [];
  const app = appHarness(async (_, options) => {
    requests.push(JSON.parse(options.body));
    return response('answer');
  });
  app.state.apiKeys.openaiKey = 'test-only';
  app.state.importedContent = [{ mention: 'reference', name: 'Reference', content: 'source material' }];
  app.state.currentAttachment = { type: 'image', name: 'sample.png', data: 'data:image/png;base64,AAAA' };
  app.input.value = '@gpt-4o @reference question';
  await app.sendMessage();
  const content = requests[0].messages[0].content;
  assert.match(content[0].text, /source material/);
  assert.match(content[0].text, /question/);
  assert.equal(content[1].image_url.url, 'data:image/png;base64,AAAA');
  assert.equal(app.state.currentAttachment, null);
  assert.equal(app.state.messages.general[0].attachment.name, 'sample.png');
});

test('HTML escaping protects both text and quoted attributes', () => {
  const app = appHarness();
  assert.equal(app.escapeHtml(`<>&"'`), '&lt;&gt;&amp;&quot;&#39;');
});

test('imported message metadata cannot inject HTML or break image attributes', () => {
  const app = appHarness();
  app.state.customModels = [{ mention: 'custom', name: '<img src=x onerror=alert(1)>' }];
  const html = app.renderMessage({
    role: 'assistant', model: 'custom', content: '<script>alert(1)</script>',
    attachment: { type: 'image', data: 'x" onerror="alert(1)', name: 'image" onload="alert(1)' },
  });
  assert.doesNotMatch(html, /<script|<img src=x|src="x" onerror|alt="image" onload/);
  assert.match(html, /src="x&quot; onerror=&quot;alert\(1\)"/);
  const unknownModel = app.renderMessage({ role: 'assistant', model: '<img src=x onerror=alert(1)>', content: 'test' });
  assert.doesNotMatch(unknownModel, /<img/);
});

test('imported channel and mention metadata is escaped in every selector', () => {
  const app = appHarness();
  const containers = new Map();
  app.document.getElementById = id => {
    if (!containers.has(id)) containers.set(id, {
      innerHTML: '', classList: { add() {}, remove() {} }, querySelectorAll: () => [],
    });
    return containers.get(id);
  };
  const mention = 'probe" onclick="alert(1)';
  const name = '<img src=x onerror=alert(1)>';
  app.state.channels = [{ id: mention, name }];
  app.state.gpts = [{ mention, name, description: mention }];
  app.state.importedContent = [{ mention, name, content: 'test' }];
  app.state.customModels = [{ mention, name }];
  app.renderChannels();
  app.renderGpts();
  app.renderImportedContent();
  app.showMentions();
  for (const id of ['channelList', 'gptsList', 'importedContent', 'mentionsDropdown']) {
    const html = containers.get(id)?.innerHTML;
    assert.ok(html, `${id} rendered`);
    assert.doesNotMatch(html, /<img|" onclick="alert/);
    assert.match(html, /probe&quot; onclick=&quot;alert/);
  }
});

test('the typing indicator displays a custom model name as text', () => {
  const app = appHarness();
  let indicator;
  const container = { appendChild: node => { indicator = node; } };
  app.document.getElementById = id => id === 'messagesArea' ? container : null;
  app.document.createElement = () => ({});
  app.state.customModels = [{ mention: 'custom', name: '<img src=x onerror=alert(1)>' }];
  app.showTypingIndicator('custom');
  assert.doesNotMatch(indicator.innerHTML, /<img/);
  assert.match(indicator.innerHTML, /&lt;img/);
});
