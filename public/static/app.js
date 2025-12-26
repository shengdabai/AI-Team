// AI Team Hub - Main Application v2.0
(function() {
  'use strict';

  // ==================== Constants ====================
  const STORAGE_KEYS = {
    API_KEYS: 'aiteam_api_keys',
    CHANNELS: 'aiteam_channels',
    MESSAGES: 'aiteam_messages',
    GPTS: 'aiteam_gpts',
    IMPORTED_CONTENT: 'aiteam_imported',
    CUSTOM_MODELS: 'aiteam_custom_models',
    CURRENT_CHANNEL: 'aiteam_current_channel'
  };

  // Complete AI Models organized by Provider (Updated Dec 2025)
  const AI_PROVIDERS = {
    openai: {
      name: 'OpenAI',
      icon: 'fa-robot',
      color: '#10a37f',
      keyName: 'openaiKey',
      models: [
        // GPT-5 Series (Latest Dec 2025)
        { id: 'gpt-5.2', name: 'GPT-5.2', tag: 'LATEST' },
        { id: 'gpt-5.1', name: 'GPT-5.1' },
        { id: 'gpt-5', name: 'GPT-5' },
        // GPT-4.5 Series
        { id: 'gpt-4.5-preview', name: 'GPT-4.5 Preview' },
        // GPT-4o Series
        { id: 'gpt-4o', name: 'GPT-4o' },
        { id: 'gpt-4o-mini', name: 'GPT-4o Mini', tag: 'Fast' },
        // o-Series Reasoning Models
        { id: 'o3', name: 'o3', tag: 'Reasoning' },
        { id: 'o3-mini', name: 'o3-mini' },
        { id: 'o1', name: 'o1' },
        { id: 'o1-mini', name: 'o1-mini' },
        // Legacy
        { id: 'gpt-4-turbo', name: 'GPT-4 Turbo' },
        { id: 'gpt-4', name: 'GPT-4' },
      ]
    },
    claude: {
      name: 'Anthropic',
      icon: 'fa-cloud',
      color: '#d97850',
      keyName: 'claudeKey',
      models: [
        // Claude 4.5 Series (Latest Nov 2025)
        { id: 'claude-opus-4.5', name: 'Claude Opus 4.5', tag: 'LATEST' },
        { id: 'claude-sonnet-4.5', name: 'Claude Sonnet 4.5' },
        { id: 'claude-haiku-4.5', name: 'Claude Haiku 4.5', tag: 'Fast' },
        // Claude 4 Series
        { id: 'claude-opus-4', name: 'Claude Opus 4' },
        { id: 'claude-sonnet-4', name: 'Claude Sonnet 4' },
        // Claude 3.7 (Hybrid Reasoning)
        { id: 'claude-3-7-sonnet', name: 'Claude 3.7 Sonnet', tag: 'Hybrid' },
        // Claude 3.5 Series
        { id: 'claude-3-5-sonnet-20241022', name: 'Claude 3.5 Sonnet' },
        { id: 'claude-3-5-haiku-20241022', name: 'Claude 3.5 Haiku' },
      ]
    },
    gemini: {
      name: 'Google',
      icon: 'fa-gem',
      color: '#4285f4',
      keyName: 'geminiKey',
      models: [
        // Gemini 3 Series (Latest Dec 2025)
        { id: 'gemini-3-pro', name: 'Gemini 3 Pro', tag: 'LATEST' },
        { id: 'gemini-3-pro-vision', name: 'Gemini 3 Pro Vision', tag: 'Vision' },
        { id: 'gemini-3-flash', name: 'Gemini 3 Flash', tag: 'Fast' },
        // Gemini 2.5 Series
        { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro' },
        { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash' },
        // Gemini 2.0 Series
        { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash' },
        { id: 'gemini-2.0-flash-lite', name: 'Gemini 2.0 Flash Lite' },
        // Legacy
        { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro' },
      ]
    },
    grok: {
      name: 'xAI',
      icon: 'fab fa-x-twitter',
      color: '#ffffff',
      keyName: 'grokKey',
      models: [
        // Grok 4 Series (Latest Nov 2025)
        { id: 'grok-4.1', name: 'Grok 4.1', tag: 'LATEST' },
        { id: 'grok-4', name: 'Grok 4' },
        // Grok 3 Series
        { id: 'grok-3', name: 'Grok 3' },
        { id: 'grok-3-mini', name: 'Grok 3 Mini', tag: 'Fast' },
        // Grok 2 Series
        { id: 'grok-2', name: 'Grok 2' },
        { id: 'grok-2-mini', name: 'Grok 2 Mini' },
      ]
    },
    deepseek: {
      name: 'DeepSeek',
      icon: 'fa-fish',
      color: '#00b4d8',
      keyName: 'deepseekKey',
      models: [
        // V3.2 Series (Latest Dec 2025)
        { id: 'deepseek-v3.2', name: 'DeepSeek V3.2', tag: 'LATEST' },
        { id: 'deepseek-v3.2-exp', name: 'DeepSeek V3.2 Exp', tag: 'Reasoning' },
        // V3.1 Series
        { id: 'deepseek-v3.1', name: 'DeepSeek V3.1' },
        // R1 Reasoning Model
        { id: 'deepseek-r1', name: 'DeepSeek R1', tag: 'Reasoning' },
        // V3 & Coder
        { id: 'deepseek-chat', name: 'DeepSeek V3' },
        { id: 'deepseek-coder', name: 'DeepSeek Coder', tag: 'Code' },
      ]
    },
    openrouter: {
      name: 'OpenRouter',
      icon: 'fa-route',
      color: '#a855f7',
      keyName: 'openrouterKey',
      models: [
        // Latest & Most Popular (Dec 2025)
        { id: 'openai/gpt-5.2', name: 'GPT-5.2', tag: 'HOT' },
        { id: 'anthropic/claude-opus-4.5', name: 'Claude Opus 4.5', tag: 'HOT' },
        { id: 'google/gemini-3-pro', name: 'Gemini 3 Pro', tag: 'NEW' },
        { id: 'x-ai/grok-4.1', name: 'Grok 4.1', tag: 'NEW' },
        { id: 'deepseek/deepseek-v3.2', name: 'DeepSeek V3.2' },
        { id: 'openai/o3', name: 'o3', tag: 'Reasoning' },
        { id: 'deepseek/deepseek-r1', name: 'DeepSeek R1', tag: 'Reasoning' },
        // Meta Llama 4 Series
        { id: 'meta-llama/llama-4-maverick', name: 'Llama 4 Maverick', tag: 'Open' },
        { id: 'meta-llama/llama-4-scout', name: 'Llama 4 Scout' },
        { id: 'meta-llama/llama-3.3-70b-instruct', name: 'Llama 3.3 70B' },
        // Mistral
        { id: 'mistralai/mistral-large-2411', name: 'Mistral Large' },
        { id: 'mistralai/codestral-latest', name: 'Codestral', tag: 'Code' },
        // Qwen
        { id: 'qwen/qwen-2.5-72b-instruct', name: 'Qwen 2.5 72B' },
        { id: 'qwen/qwq-32b', name: 'QwQ 32B', tag: 'Reasoning' },
        // Perplexity (Search)
        { id: 'perplexity/sonar-pro', name: 'Sonar Pro', tag: 'Search' },
        { id: 'perplexity/sonar-reasoning-pro', name: 'Sonar Reasoning', tag: 'Search' },
        // Others
        { id: 'cohere/command-r-plus', name: 'Command R+' },
        { id: 'z-ai/glm-4.7', name: 'GLM 4.7', tag: 'NEW' },
      ]
    },
    doubao: {
      name: '豆包',
      icon: 'fa-fire',
      color: '#ff6b6b',
      keyName: 'doubaoKey',
      models: [
        { id: 'doubao-pro-256k', name: '豆包 Pro 256K', tag: 'LATEST' },
        { id: 'doubao-pro-128k', name: '豆包 Pro 128K' },
        { id: 'doubao-pro-32k', name: '豆包 Pro 32K' },
        { id: 'doubao-lite-128k', name: '豆包 Lite 128K', tag: 'Fast' },
        { id: 'doubao-lite-32k', name: '豆包 Lite 32K' },
      ]
    },
    qwen: {
      name: '通义千问',
      icon: 'fa-cloud-sun',
      color: '#7c3aed',
      keyName: 'qwenKey',
      models: [
        { id: 'qwen-max-latest', name: 'Qwen Max', tag: 'LATEST' },
        { id: 'qwen-plus-latest', name: 'Qwen Plus' },
        { id: 'qwen-turbo-latest', name: 'Qwen Turbo', tag: 'Fast' },
        { id: 'qwen-long', name: 'Qwen Long', tag: '1M Context' },
        { id: 'qwen-coder-plus', name: 'Qwen Coder Plus', tag: 'Code' },
      ]
    },
    kimi: {
      name: 'Kimi',
      icon: 'fa-moon',
      color: '#fbbf24',
      keyName: 'kimiKey',
      models: [
        { id: 'moonshot-v1-auto', name: 'Moonshot Auto', tag: 'LATEST' },
        { id: 'moonshot-v1-128k', name: 'Moonshot 128K' },
        { id: 'moonshot-v1-32k', name: 'Moonshot 32K' },
        { id: 'moonshot-v1-8k', name: 'Moonshot 8K', tag: 'Fast' },
      ]
    },
    glm: {
      name: '智谱GLM',
      icon: 'fa-brain',
      color: '#6366f1',
      keyName: 'glmKey',
      models: [
        { id: 'glm-4.7', name: 'GLM-4.7', tag: 'LATEST' },
        { id: 'glm-4-plus', name: 'GLM-4 Plus' },
        { id: 'glm-4', name: 'GLM-4' },
        { id: 'glm-4-flash', name: 'GLM-4 Flash', tag: 'Fast' },
        { id: 'glm-4-air', name: 'GLM-4 Air' },
      ]
    }
  };

  // ==================== State ====================
  let state = {
    apiKeys: {},
    channels: [{ id: 'general', name: 'general', desc: 'AI团队协作频道' }],
    messages: { general: [] },
    gpts: [],
    importedContent: [],
    customModels: [],
    currentChannel: 'general',
    currentAttachment: null,
    urlContent: null,
    mentionIndex: -1,
    expandedProvider: null
  };

  // ==================== Storage ====================
  function loadState() {
    try {
      state.apiKeys = JSON.parse(localStorage.getItem(STORAGE_KEYS.API_KEYS) || '{}');
      state.channels = JSON.parse(localStorage.getItem(STORAGE_KEYS.CHANNELS) || '[{"id":"general","name":"general","desc":"AI团队协作频道"}]');
      state.messages = JSON.parse(localStorage.getItem(STORAGE_KEYS.MESSAGES) || '{"general":[]}');
      state.gpts = JSON.parse(localStorage.getItem(STORAGE_KEYS.GPTS) || '[]');
      state.importedContent = JSON.parse(localStorage.getItem(STORAGE_KEYS.IMPORTED_CONTENT) || '[]');
      state.customModels = JSON.parse(localStorage.getItem(STORAGE_KEYS.CUSTOM_MODELS) || '[]');
      state.currentChannel = localStorage.getItem(STORAGE_KEYS.CURRENT_CHANNEL) || 'general';
    } catch (e) {
      console.error('Error loading state:', e);
    }
  }

  function saveState() {
    localStorage.setItem(STORAGE_KEYS.API_KEYS, JSON.stringify(state.apiKeys));
    localStorage.setItem(STORAGE_KEYS.CHANNELS, JSON.stringify(state.channels));
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(state.messages));
    localStorage.setItem(STORAGE_KEYS.GPTS, JSON.stringify(state.gpts));
    localStorage.setItem(STORAGE_KEYS.IMPORTED_CONTENT, JSON.stringify(state.importedContent));
    localStorage.setItem(STORAGE_KEYS.CUSTOM_MODELS, JSON.stringify(state.customModels));
    localStorage.setItem(STORAGE_KEYS.CURRENT_CHANNEL, state.currentChannel);
  }

  // ==================== Encryption ====================
  function encryptKey(key) {
    return btoa(key);
  }

  function decryptKey(encrypted) {
    try {
      return atob(encrypted);
    } catch {
      return encrypted;
    }
  }

  // ==================== UI Rendering ====================
  function renderChannels() {
    const container = document.getElementById('channelList');
    container.innerHTML = state.channels.map(ch => `
      <div class="channel-item ${ch.id === state.currentChannel ? 'active' : ''}" data-channel="${ch.id}">
        <i class="fas fa-hashtag text-gray-400 mr-2"></i>
        <span>${ch.name}</span>
      </div>
    `).join('');

    container.querySelectorAll('.channel-item').forEach(el => {
      el.addEventListener('click', () => switchChannel(el.dataset.channel));
    });

    document.getElementById('currentChannelName').textContent = state.channels.find(c => c.id === state.currentChannel)?.name || 'general';
  }

  function renderModels() {
    const container = document.getElementById('modelList');
    let html = '';

    Object.entries(AI_PROVIDERS).forEach(([providerKey, provider]) => {
      const hasKey = state.apiKeys[provider.keyName];
      const statusClass = hasKey ? 'online' : 'offline';
      
      html += `
        <div class="provider-group mb-2">
          <div class="provider-header flex items-center justify-between px-2 py-1.5 rounded cursor-pointer hover:bg-slack-hover ${hasKey ? 'text-white' : 'text-gray-500'}" data-provider="${providerKey}">
            <div class="flex items-center gap-2">
              <span class="status-dot ${statusClass}"></span>
              <i class="${provider.icon.startsWith('fab') ? provider.icon : 'fas ' + provider.icon}" style="color: ${provider.color}"></i>
              <span class="text-sm">${provider.name}</span>
            </div>
            <i class="fas fa-chevron-down text-xs text-gray-500 transition-transform ${state.expandedProvider === providerKey ? 'rotate-180' : ''}"></i>
          </div>
          <div class="provider-models pl-6 ${state.expandedProvider === providerKey ? '' : 'hidden'}">
            ${provider.models.slice(0, 5).map(m => `
              <div class="model-item flex items-center gap-2 px-2 py-1 text-xs text-gray-400 hover:text-white hover:bg-slack-hover rounded cursor-pointer" data-model="${m.id}" data-provider="${providerKey}">
                <span>@${m.id.split('/').pop()}</span>
                ${m.tag ? `<span class="text-[10px] px-1 rounded bg-purple-500/20 text-purple-300">${m.tag}</span>` : ''}
              </div>
            `).join('')}
            ${provider.models.length > 5 ? `<div class="text-xs text-gray-500 px-2 py-1">+${provider.models.length - 5} more...</div>` : ''}
          </div>
        </div>
      `;
    });

    container.innerHTML = html;

    // Add click handlers for provider headers
    container.querySelectorAll('.provider-header').forEach(el => {
      el.addEventListener('click', () => {
        const provider = el.dataset.provider;
        state.expandedProvider = state.expandedProvider === provider ? null : provider;
        renderModels();
      });
    });

    // Add click handlers for model items (insert into input)
    container.querySelectorAll('.model-item').forEach(el => {
      el.addEventListener('click', () => {
        const modelId = el.dataset.model;
        const input = document.getElementById('messageInput');
        const shortName = modelId.split('/').pop();
        input.value += `@${shortName} `;
        input.focus();
      });
    });
  }

  function renderGpts() {
    const container = document.getElementById('gptsList');
    if (state.gpts.length === 0) {
      container.innerHTML = '<div class="text-gray-500 text-xs px-2">点击上方图标导入GPTs</div>';
      return;
    }

    container.innerHTML = state.gpts.map(gpt => `
      <div class="flex items-center gap-2 px-2 py-1 text-gray-300 cursor-pointer hover:bg-slack-hover rounded" title="${gpt.description || ''}" data-gpt="${gpt.mention}">
        <span class="status-dot online"></span>
        <i class="fas fa-magic text-purple-400"></i>
        <span class="truncate text-sm">@${gpt.mention}</span>
      </div>
    `).join('');

    container.querySelectorAll('[data-gpt]').forEach(el => {
      el.addEventListener('click', () => {
        const input = document.getElementById('messageInput');
        input.value += `@${el.dataset.gpt} `;
        input.focus();
      });
    });
  }

  function renderImportedContent() {
    const container = document.getElementById('importedContent');
    if (state.importedContent.length === 0) {
      container.innerHTML = '<div class="text-gray-500 text-xs px-2">点击上方图标导入内容</div>';
      return;
    }

    container.innerHTML = state.importedContent.map((item, idx) => `
      <div class="flex items-center justify-between gap-2 px-2 py-1 text-gray-300 group">
        <div class="flex items-center gap-2 truncate cursor-pointer hover:text-white" data-content="${item.mention}">
          <i class="fas ${item.source === 'getnote' ? 'fa-sticky-note text-yellow-400' : item.source === 'notebooklm' ? 'fa-book text-blue-400' : 'fa-file text-gray-400'}"></i>
          <span class="truncate text-sm" title="${item.name}">@${item.mention}</span>
        </div>
        <button class="hidden group-hover:block text-gray-500 hover:text-red-400" onclick="removeImportedContent(${idx})">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `).join('');

    container.querySelectorAll('[data-content]').forEach(el => {
      el.addEventListener('click', () => {
        const input = document.getElementById('messageInput');
        input.value += `@${el.dataset.content} `;
        input.focus();
      });
    });
  }

  function renderMessages() {
    const container = document.getElementById('messagesArea');
    const messages = state.messages[state.currentChannel] || [];

    if (messages.length === 0) {
      container.innerHTML = `
        <div class="text-center text-gray-500 py-8">
          <i class="fas fa-comments text-4xl mb-4"></i>
          <p>开始与AI团队对话</p>
          <p class="text-sm mt-2">使用 @ 来选择AI模型，例如: @gpt-4o 你好</p>
        </div>
      `;
      return;
    }

    container.innerHTML = messages.map(msg => renderMessage(msg)).join('');
    container.scrollTop = container.scrollHeight;
  }

  function renderMessage(msg) {
    const isUser = msg.role === 'user';
    const providerInfo = getProviderForModel(msg.model);
    
    let content = msg.content;
    if (!isUser) {
      content = DOMPurify.sanitize(marked.parse(msg.content));
    } else {
      content = escapeHtml(msg.content);
    }

    let attachmentHtml = '';
    if (msg.attachment) {
      if (msg.attachment.type === 'image') {
        attachmentHtml = `
          <div class="file-attachment">
            <img src="${msg.attachment.data}" alt="${msg.attachment.name}" />
          </div>
        `;
      } else if (msg.attachment.type === 'url') {
        attachmentHtml = `
          <div class="url-preview">
            <div class="text-xs text-gray-400 mb-1"><i class="fas fa-link mr-1"></i>${msg.attachment.url}</div>
            <div class="text-sm text-gray-300">${msg.attachment.content.substring(0, 200)}...</div>
          </div>
        `;
      } else {
        attachmentHtml = `
          <div class="file-attachment">
            <i class="fas fa-file text-2xl text-gray-400"></i>
            <div>
              <div class="text-sm font-medium">${msg.attachment.name}</div>
              <div class="text-xs text-gray-500">${msg.attachment.type}</div>
            </div>
          </div>
        `;
      }
    }

    if (msg.context) {
      attachmentHtml += `
        <div class="context-content">
          <div class="context-label"><i class="fas fa-quote-left mr-1"></i>引用内容: ${msg.context.name}</div>
          <div class="text-gray-300">${msg.context.content.substring(0, 300)}...</div>
        </div>
      `;
    }

    const avatarStyle = isUser ? 'background-color: var(--slack-accent);' : `background-color: ${providerInfo?.color || '#374151'};`;

    return `
      <div class="message ${isUser ? 'user' : 'ai'} fade-in">
        <div class="message-avatar" style="${avatarStyle}">
          ${isUser ? '<i class="fas fa-user"></i>' : getModelIcon(msg.model)}
        </div>
        <div class="message-content">
          <div class="message-header">
            <span class="message-author">${isUser ? 'Tony' : getModelDisplayName(msg.model)}</span>
            ${!isUser ? `<span class="model-badge" style="background-color: ${providerInfo?.color}20; color: ${providerInfo?.color}">@${msg.model}</span>` : ''}
            <span class="message-time">${formatTime(msg.timestamp)}</span>
          </div>
          <div class="message-body">${content}</div>
          ${attachmentHtml}
        </div>
      </div>
    `;
  }

  function getProviderForModel(modelId) {
    for (const [key, provider] of Object.entries(AI_PROVIDERS)) {
      if (provider.models.some(m => m.id === modelId || m.id.split('/').pop() === modelId || modelId.includes(key))) {
        return { ...provider, key };
      }
    }
    return null;
  }

  function getModelIcon(modelId) {
    const provider = getProviderForModel(modelId);
    if (provider) {
      if (provider.icon.startsWith('fab')) {
        return `<i class="${provider.icon}"></i>`;
      }
      return `<i class="fas ${provider.icon}"></i>`;
    }
    return '<i class="fas fa-robot"></i>';
  }

  function getModelDisplayName(modelId) {
    for (const provider of Object.values(AI_PROVIDERS)) {
      const model = provider.models.find(m => m.id === modelId || m.id.split('/').pop() === modelId);
      if (model) return model.name;
    }
    
    const gpt = state.gpts.find(g => g.mention === modelId);
    if (gpt) return gpt.name;
    
    const custom = state.customModels.find(m => m.mention === modelId);
    if (custom) return custom.name;
    
    return modelId;
  }

  // ==================== Mention System with Sub-menu ====================
  function showMentions(filter = '') {
    const dropdown = document.getElementById('mentionsDropdown');
    const filterLower = filter.toLowerCase();
    
    let html = '';
    
    // Show providers and their models
    Object.entries(AI_PROVIDERS).forEach(([providerKey, provider]) => {
      const hasKey = state.apiKeys[provider.keyName];
      if (!hasKey) return;

      // Filter models
      const matchingModels = provider.models.filter(m => 
        m.id.toLowerCase().includes(filterLower) ||
        m.name.toLowerCase().includes(filterLower) ||
        providerKey.includes(filterLower)
      );

      if (matchingModels.length === 0 && !providerKey.includes(filterLower) && !provider.name.toLowerCase().includes(filterLower)) {
        return;
      }

      html += `
        <div class="mention-provider">
          <div class="mention-provider-header px-3 py-2 flex items-center gap-2 text-sm font-medium border-b border-slack-border" style="color: ${provider.color}">
            <i class="${provider.icon.startsWith('fab') ? provider.icon : 'fas ' + provider.icon}"></i>
            ${provider.name}
          </div>
          <div class="mention-models">
            ${(filterLower ? matchingModels : provider.models).map(m => `
              <div class="mention-item px-3 py-2 flex items-center justify-between hover:bg-slack-hover cursor-pointer" data-model="${m.id}" data-provider="${providerKey}">
                <div class="flex items-center gap-2">
                  <span class="text-white">@${m.id.split('/').pop()}</span>
                  <span class="text-xs text-gray-500">${m.name}</span>
                </div>
                ${m.tag ? `<span class="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300">${m.tag}</span>` : ''}
              </div>
            `).join('')}
          </div>
        </div>
      `;
    });

    // GPTs
    const matchingGpts = state.gpts.filter(g => 
      g.mention.toLowerCase().includes(filterLower) ||
      g.name.toLowerCase().includes(filterLower)
    );
    if (matchingGpts.length > 0) {
      html += `
        <div class="mention-provider">
          <div class="mention-provider-header px-3 py-2 flex items-center gap-2 text-sm font-medium border-b border-slack-border text-purple-400">
            <i class="fas fa-magic"></i>
            我的GPTs
          </div>
          <div class="mention-models">
            ${matchingGpts.map(g => `
              <div class="mention-item px-3 py-2 flex items-center gap-2 hover:bg-slack-hover cursor-pointer" data-gpt="${g.mention}">
                <span class="text-white">@${g.mention}</span>
                <span class="text-xs text-gray-500">${g.name}</span>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    // Imported Content
    const matchingContent = state.importedContent.filter(i => 
      i.mention.toLowerCase().includes(filterLower) ||
      i.name.toLowerCase().includes(filterLower)
    );
    if (matchingContent.length > 0) {
      html += `
        <div class="mention-provider">
          <div class="mention-provider-header px-3 py-2 flex items-center gap-2 text-sm font-medium border-b border-slack-border text-yellow-400">
            <i class="fas fa-file-import"></i>
            导入内容
          </div>
          <div class="mention-models">
            ${matchingContent.map(i => `
              <div class="mention-item px-3 py-2 flex items-center gap-2 hover:bg-slack-hover cursor-pointer" data-content="${i.mention}">
                <span class="text-white">@${i.mention}</span>
                <span class="text-xs text-gray-500">${i.name}</span>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    // Custom Models
    const matchingCustom = state.customModels.filter(m => 
      m.mention.toLowerCase().includes(filterLower) ||
      m.name.toLowerCase().includes(filterLower)
    );
    if (matchingCustom.length > 0) {
      html += `
        <div class="mention-provider">
          <div class="mention-provider-header px-3 py-2 flex items-center gap-2 text-sm font-medium border-b border-slack-border text-pink-400">
            <i class="fas fa-cog"></i>
            自定义模型
          </div>
          <div class="mention-models">
            ${matchingCustom.map(m => `
              <div class="mention-item px-3 py-2 flex items-center gap-2 hover:bg-slack-hover cursor-pointer" data-custom="${m.mention}">
                <span class="text-white">@${m.mention}</span>
                <span class="text-xs text-gray-500">${m.name}</span>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    if (!html) {
      dropdown.classList.add('hidden');
      return;
    }

    dropdown.innerHTML = html;
    dropdown.classList.remove('hidden');

    // Add click handlers
    dropdown.querySelectorAll('.mention-item').forEach(el => {
      el.addEventListener('click', () => {
        const model = el.dataset.model || el.dataset.gpt || el.dataset.content || el.dataset.custom;
        insertMention(model ? model.split('/').pop() : '');
      });
    });
  }

  function hideMentions() {
    document.getElementById('mentionsDropdown').classList.add('hidden');
  }

  function insertMention(mention) {
    const input = document.getElementById('messageInput');
    const text = input.value;
    const atIndex = text.lastIndexOf('@');
    
    if (atIndex !== -1) {
      input.value = text.substring(0, atIndex) + '@' + mention + ' ';
    }
    
    hideMentions();
    input.focus();
  }

  // ==================== Message Handling ====================
  async function sendMessage() {
    const input = document.getElementById('messageInput');
    const text = input.value.trim();
    
    if (!text && !state.currentAttachment && !state.urlContent) return;

    // Parse mentions - support both short and full model IDs
    const mentionRegex = /@([\w\-\.\/]+)/g;
    const mentions = [...text.matchAll(mentionRegex)].map(m => m[1]);
    
    // Find valid AI mentions
    const aiMentions = [];
    mentions.forEach(m => {
      // Check built-in models
      for (const [providerKey, provider] of Object.entries(AI_PROVIDERS)) {
        const model = provider.models.find(mod => 
          mod.id === m || 
          mod.id.split('/').pop() === m ||
          mod.id.endsWith('/' + m)
        );
        if (model && state.apiKeys[provider.keyName]) {
          aiMentions.push({ model: model.id, provider: providerKey });
          return;
        }
      }
      
      // Check GPTs
      if (state.gpts.find(g => g.mention === m)) {
        aiMentions.push({ model: m, provider: 'openai', isGpt: true });
        return;
      }
      
      // Check custom models
      const custom = state.customModels.find(c => c.mention === m);
      if (custom) {
        aiMentions.push({ model: m, provider: 'custom', customConfig: custom });
      }
    });
    
    // Find context mentions (imported content)
    const contextMentions = mentions.filter(m => state.importedContent.find(i => i.mention === m));

    // Build user message
    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
      attachment: state.currentAttachment,
      context: contextMentions.length > 0 ? state.importedContent.find(i => i.mention === contextMentions[0]) : null
    };

    if (!state.messages[state.currentChannel]) {
      state.messages[state.currentChannel] = [];
    }
    state.messages[state.currentChannel].push(userMessage);
    saveState();
    renderMessages();

    input.value = '';
    clearAttachment();

    if (aiMentions.length === 0) {
      showToast('提示: 使用 @ 来选择AI模型', 'info');
      return;
    }

    // Send to each mentioned AI
    for (const ai of aiMentions) {
      await callAI(ai, text, userMessage);
    }
  }

  async function callAI(ai, userText, userMessage) {
    const modelShortName = ai.model.split('/').pop();
    showTypingIndicator(modelShortName);

    try {
      let response;
      
      if (ai.provider === 'custom' && ai.customConfig) {
        response = await callCustomModel(ai.customConfig, userText, userMessage);
      } else {
        response = await callBuiltInModel(ai, userText, userMessage);
      }

      const aiMessage = {
        id: Date.now(),
        role: 'assistant',
        model: modelShortName,
        content: response,
        timestamp: new Date().toISOString()
      };

      state.messages[state.currentChannel].push(aiMessage);
      saveState();

    } catch (error) {
      console.error('AI call error:', error);
      
      const errorMessage = {
        id: Date.now(),
        role: 'assistant',
        model: modelShortName,
        content: `**错误**: ${error.message}\n\n请检查:\n1. API Key 是否正确配置\n2. 网络连接是否正常\n3. API 额度是否充足`,
        timestamp: new Date().toISOString()
      };

      state.messages[state.currentChannel].push(errorMessage);
      saveState();
    }

    hideTypingIndicator();
    renderMessages();
  }

  async function callBuiltInModel(ai, userText, userMessage) {
    const provider = AI_PROVIDERS[ai.provider];
    const apiKey = decryptKey(state.apiKeys[provider.keyName]);

    if (!apiKey) {
      throw new Error(`请先配置 ${provider.name} 的 API Key`);
    }

    const messages = buildMessageHistory(userText, userMessage);

    const response = await fetch(`/api/proxy/${ai.provider}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey,
        'X-Model': ai.model
      },
      body: JSON.stringify({
        model: ai.model,
        messages: messages,
        max_tokens: 4096
      })
    });

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error.message || data.error);
    }

    return data.choices?.[0]?.message?.content || '无响应内容';
  }

  async function callCustomModel(custom, userText, userMessage) {
    const response = await fetch(custom.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${custom.apiKey}`
      },
      body: JSON.stringify({
        model: custom.modelId || 'default',
        messages: buildMessageHistory(userText, userMessage),
        max_tokens: 4096
      })
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error.message || data.error);
    
    return data.choices?.[0]?.message?.content || '无响应内容';
  }

  function buildMessageHistory(currentText, currentMessage) {
    const messages = [];
    const channelMessages = state.messages[state.currentChannel] || [];
    const recentMessages = channelMessages.slice(-10);
    
    for (const msg of recentMessages) {
      if (msg.role === 'user') {
        let content = msg.content;
        
        if (msg.context) {
          content = `[引用内容: ${msg.context.name}]\n${msg.context.content}\n\n用户问题: ${content}`;
        }
        
        if (msg.attachment) {
          if (msg.attachment.type === 'url') {
            content = `[网页内容来自: ${msg.attachment.url}]\n${msg.attachment.content}\n\n用户问题: ${content}`;
          } else if (msg.attachment.type === 'image') {
            content = `[用户上传了图片: ${msg.attachment.name}]\n\n${content}`;
          } else {
            content = `[用户上传了文件: ${msg.attachment.name}]\n${msg.attachment.content || ''}\n\n${content}`;
          }
        }
        
        messages.push({ role: 'user', content });
      } else {
        messages.push({ role: 'assistant', content: msg.content });
      }
    }

    return messages;
  }

  function showTypingIndicator(model) {
    const container = document.getElementById('messagesArea');
    const indicator = document.createElement('div');
    indicator.id = 'typingIndicator';
    indicator.className = 'message ai fade-in';
    indicator.innerHTML = `
      <div class="message-avatar" style="background-color: #374151;">
        ${getModelIcon(model)}
      </div>
      <div class="message-content">
        <div class="message-header">
          <span class="message-author">${getModelDisplayName(model)}</span>
          <span class="text-gray-400 text-sm">正在输入...</span>
        </div>
        <div class="typing-indicator">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    `;
    container.appendChild(indicator);
    container.scrollTop = container.scrollHeight;
  }

  function hideTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) indicator.remove();
  }

  // ==================== File Handling ====================
  function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    
    if (file.type.startsWith('image/')) {
      reader.onload = (e) => {
        state.currentAttachment = {
          type: 'image',
          name: file.name,
          data: e.target.result
        };
        showFilePreview();
      };
      reader.readAsDataURL(file);
    } else {
      reader.onload = (e) => {
        state.currentAttachment = {
          type: file.type || 'file',
          name: file.name,
          content: e.target.result
        };
        showFilePreview();
      };
      reader.readAsText(file);
    }
  }

  function showFilePreview() {
    const preview = document.getElementById('filePreview');
    const fileName = document.getElementById('fileName');
    const fileIcon = document.getElementById('fileIcon');
    const imagePreviewContainer = document.getElementById('imagePreviewContainer');
    const imagePreview = document.getElementById('imagePreview');

    preview.classList.remove('hidden');
    fileName.textContent = state.currentAttachment.name;

    if (state.currentAttachment.type === 'image') {
      fileIcon.className = 'fas fa-image text-slack-accent';
      imagePreviewContainer.classList.remove('hidden');
      imagePreview.src = state.currentAttachment.data;
    } else {
      fileIcon.className = 'fas fa-file text-slack-accent';
      imagePreviewContainer.classList.add('hidden');
    }
  }

  function clearAttachment() {
    state.currentAttachment = null;
    state.urlContent = null;
    document.getElementById('filePreview').classList.add('hidden');
    document.getElementById('fileInput').value = '';
  }

  // ==================== URL Handling ====================
  async function fetchUrlContent() {
    const urlInput = document.getElementById('urlInput');
    const url = urlInput.value.trim();

    if (!url) {
      showToast('请输入有效的URL', 'error');
      return;
    }

    try {
      showToast('正在获取网页内容...', 'info');
      
      const response = await fetch('/api/fetch-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      state.currentAttachment = {
        type: 'url',
        url: url,
        content: data.content
      };

      showFilePreview();
      document.getElementById('fileName').textContent = url;
      document.getElementById('fileIcon').className = 'fas fa-link text-blue-400';
      
      closeModal('urlModal');
      urlInput.value = '';
      showToast('网页内容已添加', 'success');

    } catch (error) {
      showToast('获取网页内容失败: ' + error.message, 'error');
    }
  }

  // ==================== Channel Management ====================
  function switchChannel(channelId) {
    state.currentChannel = channelId;
    saveState();
    renderChannels();
    renderMessages();
  }

  function createNewChannel() {
    const name = prompt('输入新频道名称:');
    if (!name) return;

    const id = name.toLowerCase().replace(/\s+/g, '-');
    if (state.channels.find(c => c.id === id)) {
      showToast('频道已存在', 'error');
      return;
    }

    state.channels.push({ id, name, desc: '' });
    state.messages[id] = [];
    saveState();
    renderChannels();
    switchChannel(id);
  }

  // ==================== GPTs Import ====================
  async function importGpts() {
    const apiKey = decryptKey(state.apiKeys.openaiKey);
    if (!apiKey) {
      showToast('请先配置 OpenAI API Key', 'error');
      return;
    }

    try {
      showToast('正在获取GPTs列表...', 'info');
      
      const response = await fetch('/api/gpts/list', {
        headers: { 'X-API-Key': apiKey }
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      if (!data.data || data.data.length === 0) {
        showToast('未找到GPTs', 'info');
        return;
      }

      state.gpts = data.data.map(gpt => ({
        id: gpt.id,
        name: gpt.name,
        description: gpt.description,
        mention: gpt.name.toLowerCase().replace(/\s+/g, '-').substring(0, 20)
      }));

      saveState();
      renderGpts();
      showToast(`成功导入 ${state.gpts.length} 个GPTs`, 'success');

    } catch (error) {
      showToast('导入GPTs失败: ' + error.message, 'error');
    }
  }

  // ==================== Content Import ====================
  function saveImportContent() {
    const name = document.getElementById('importContentName').value.trim();
    const source = document.getElementById('importContentSource').value;
    const content = document.getElementById('importContentText').value.trim();

    if (!name || !content) {
      showToast('请填写名称和内容', 'error');
      return;
    }

    const mention = name.toLowerCase().replace(/\s+/g, '-').substring(0, 20);
    
    state.importedContent.push({
      name,
      source,
      content,
      mention,
      createdAt: new Date().toISOString()
    });

    saveState();
    renderImportedContent();
    closeModal('importContentModal');
    
    document.getElementById('importContentName').value = '';
    document.getElementById('importContentText').value = '';
    
    showToast('内容已导入，使用 @' + mention + ' 引用', 'success');
  }

  window.removeImportedContent = function(index) {
    state.importedContent.splice(index, 1);
    saveState();
    renderImportedContent();
    showToast('内容已删除', 'success');
  };

  // ==================== Settings ====================
  function loadApiKeysToForm() {
    Object.values(AI_PROVIDERS).forEach(provider => {
      const input = document.getElementById(provider.keyName);
      if (input && state.apiKeys[provider.keyName]) {
        input.value = decryptKey(state.apiKeys[provider.keyName]);
      }
    });
  }

  function saveApiKeys() {
    Object.values(AI_PROVIDERS).forEach(provider => {
      const input = document.getElementById(provider.keyName);
      if (input && input.value.trim()) {
        state.apiKeys[provider.keyName] = encryptKey(input.value.trim());
      } else if (input) {
        delete state.apiKeys[provider.keyName];
      }
    });

    saveState();
    renderModels();
    showToast('API Keys 已保存', 'success');
  }

  // ==================== Export ====================
  function exportToMarkdown() {
    const messages = state.messages[state.currentChannel] || [];
    if (messages.length === 0) {
      showToast('没有对话内容可导出', 'error');
      return;
    }

    let markdown = `# AI Team Hub - ${state.currentChannel}\n\n`;
    markdown += `导出时间: ${new Date().toLocaleString()}\n\n---\n\n`;

    messages.forEach(msg => {
      const author = msg.role === 'user' ? 'Tony' : getModelDisplayName(msg.model);
      const time = formatTime(msg.timestamp);
      
      markdown += `### ${author} (${time})\n\n`;
      markdown += msg.content + '\n\n';
      
      if (msg.attachment) {
        markdown += `> 附件: ${msg.attachment.name || msg.attachment.url}\n\n`;
      }
      
      markdown += '---\n\n';
    });

    downloadFile(markdown, `aiteam-${state.currentChannel}-${Date.now()}.md`, 'text/markdown');
    showToast('导出成功', 'success');
  }

  function exportAllData() {
    const data = {
      version: '2.0',
      exportedAt: new Date().toISOString(),
      channels: state.channels,
      messages: state.messages,
      gpts: state.gpts,
      importedContent: state.importedContent,
      customModels: state.customModels
    };

    downloadFile(JSON.stringify(data, null, 2), `aiteam-backup-${Date.now()}.json`, 'application/json');
    showToast('数据导出成功', 'success');
  }

  function importData(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        
        if (data.channels) state.channels = data.channels;
        if (data.messages) state.messages = data.messages;
        if (data.gpts) state.gpts = data.gpts;
        if (data.importedContent) state.importedContent = data.importedContent;
        if (data.customModels) state.customModels = data.customModels;

        saveState();
        renderAll();
        showToast('数据导入成功', 'success');
      } catch (error) {
        showToast('导入失败: 无效的JSON文件', 'error');
      }
    };
    reader.readAsText(file);
  }

  function clearAllData() {
    if (!confirm('确定要清除所有本地数据吗？此操作不可恢复！')) return;

    Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
    location.reload();
  }

  // ==================== Custom Models ====================
  function addCustomModel() {
    const name = document.getElementById('customModelName').value.trim();
    const endpoint = document.getElementById('customModelEndpoint').value.trim();
    const modelId = document.getElementById('customModelId').value.trim();
    const apiKey = document.getElementById('customModelKey').value.trim();

    if (!name || !endpoint) {
      showToast('请填写模型名称和API端点', 'error');
      return;
    }

    const mention = name.toLowerCase().replace(/\s+/g, '-');
    
    state.customModels.push({
      name,
      mention,
      endpoint,
      modelId,
      apiKey,
      createdAt: new Date().toISOString()
    });

    saveState();
    renderCustomModels();
    
    document.getElementById('customModelName').value = '';
    document.getElementById('customModelEndpoint').value = '';
    document.getElementById('customModelId').value = '';
    document.getElementById('customModelKey').value = '';
    
    showToast('自定义模型已添加，使用 @' + mention + ' 调用', 'success');
  }

  function renderCustomModels() {
    const container = document.getElementById('customModelsList');
    if (state.customModels.length === 0) {
      container.innerHTML = '<div class="text-gray-500 text-sm">暂无自定义模型</div>';
      return;
    }

    container.innerHTML = state.customModels.map((model, idx) => `
      <div class="flex items-center justify-between p-2 bg-slack-hover rounded">
        <div>
          <div class="font-medium">@${model.mention}</div>
          <div class="text-xs text-gray-400">${model.endpoint}</div>
        </div>
        <button class="text-red-400 hover:text-red-300" onclick="removeCustomModel(${idx})">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    `).join('');
  }

  window.removeCustomModel = function(index) {
    state.customModels.splice(index, 1);
    saveState();
    renderCustomModels();
  };

  // ==================== Utilities ====================
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function formatTime(isoString) {
    const date = new Date(isoString);
    return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
  }

  function downloadFile(content, filename, type) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => toast.remove(), 3000);
  }

  function openModal(id) {
    document.getElementById(id).classList.remove('hidden');
  }

  function closeModal(id) {
    document.getElementById(id).classList.add('hidden');
  }

  function renderAll() {
    renderChannels();
    renderModels();
    renderGpts();
    renderImportedContent();
    renderMessages();
    renderCustomModels();
  }

  // ==================== Event Listeners ====================
  function initEventListeners() {
    const messageInput = document.getElementById('messageInput');
    messageInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
      
      if (e.key === 'Escape') {
        hideMentions();
      }
    });

    messageInput.addEventListener('input', (e) => {
      const text = e.target.value;
      const atIndex = text.lastIndexOf('@');
      
      if (atIndex !== -1 && atIndex === text.length - 1) {
        showMentions();
      } else if (atIndex !== -1) {
        const afterAt = text.substring(atIndex + 1);
        const spaceIndex = afterAt.indexOf(' ');
        if (spaceIndex === -1) {
          showMentions(afterAt);
        } else {
          hideMentions();
        }
      } else {
        hideMentions();
      }

      e.target.style.height = 'auto';
      e.target.style.height = Math.min(e.target.scrollHeight, 150) + 'px';
    });

    document.getElementById('sendBtn').addEventListener('click', sendMessage);
    document.getElementById('fileInput').addEventListener('change', handleFileSelect);
    document.getElementById('removeFile').addEventListener('click', clearAttachment);
    document.getElementById('urlBtn').addEventListener('click', () => openModal('urlModal'));
    document.getElementById('fetchUrl').addEventListener('click', fetchUrlContent);
    document.getElementById('closeUrlModal').addEventListener('click', () => closeModal('urlModal'));
    document.getElementById('newChannelBtn').addEventListener('click', createNewChannel);

    document.getElementById('settingsBtn').addEventListener('click', () => {
      loadApiKeysToForm();
      openModal('settingsModal');
    });
    document.getElementById('closeSettings').addEventListener('click', () => closeModal('settingsModal'));
    document.getElementById('saveApiKeys').addEventListener('click', saveApiKeys);

    document.querySelectorAll('.settings-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.settings-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.settings-content').forEach(c => c.classList.add('hidden'));
        tab.classList.add('active');
        document.getElementById(tab.dataset.tab + 'Tab').classList.remove('hidden');
      });
    });

    document.getElementById('importGptsBtn').addEventListener('click', importGpts);
    document.getElementById('importContentBtn').addEventListener('click', () => openModal('importContentModal'));
    document.getElementById('closeImportContent').addEventListener('click', () => closeModal('importContentModal'));
    document.getElementById('saveImportContent').addEventListener('click', saveImportContent);

    document.getElementById('exportBtn').addEventListener('click', exportToMarkdown);
    document.getElementById('clearChatBtn').addEventListener('click', () => {
      if (!confirm('确定要清空当前频道的对话吗？')) return;
      state.messages[state.currentChannel] = [];
      saveState();
      renderMessages();
      showToast('对话已清空', 'success');
    });

    document.getElementById('exportAllData').addEventListener('click', exportAllData);
    document.getElementById('importDataFile').addEventListener('change', importData);
    document.getElementById('clearAllData').addEventListener('click', clearAllData);
    document.getElementById('addCustomModel').addEventListener('click', addCustomModel);

    document.querySelectorAll('.fixed.inset-0').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.add('hidden');
        }
      });
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('#mentionsDropdown') && !e.target.closest('#messageInput')) {
        hideMentions();
      }
    });
  }

  // ==================== Initialize ====================
  function init() {
    loadState();
    initEventListeners();
    renderAll();

    marked.setOptions({
      highlight: function(code, lang) {
        if (lang && hljs.getLanguage(lang)) {
          return hljs.highlight(code, { language: lang }).value;
        }
        return code;
      },
      breaks: true
    });

    console.log('AI Team Hub v2.0 initialized');
  }

  document.addEventListener('DOMContentLoaded', init);
})();
