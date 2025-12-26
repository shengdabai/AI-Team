/**
 * AI Team Hub - Main Application v3.0
 * Professional Multi-AI Collaboration Platform
 */
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

  // Complete AI Models - Updated Dec 2025 (Using actual API model IDs)
  const AI_PROVIDERS = {
    openai: {
      name: 'OpenAI',
      icon: 'fa-robot',
      color: '#10a37f',
      keyName: 'openaiKey',
      models: [
        { id: 'gpt-4o', name: 'GPT-4o', tag: 'LATEST' },
        { id: 'gpt-4o-mini', name: 'GPT-4o Mini', tag: 'Fast' },
        { id: 'o1', name: 'o1', tag: 'Reasoning' },
        { id: 'o1-mini', name: 'o1-mini' },
        { id: 'o1-preview', name: 'o1 Preview' },
        { id: 'gpt-4-turbo', name: 'GPT-4 Turbo' },
        { id: 'gpt-4-turbo-preview', name: 'GPT-4 Turbo Preview' },
        { id: 'gpt-4', name: 'GPT-4' },
        { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', tag: 'Economy' },
      ]
    },
    claude: {
      name: 'Anthropic',
      icon: 'fa-cloud',
      color: '#d97850',
      keyName: 'claudeKey',
      models: [
        { id: 'claude-sonnet-4-20250514', name: 'Claude Sonnet 4', tag: 'LATEST' },
        { id: 'claude-3-5-sonnet-20241022', name: 'Claude 3.5 Sonnet' },
        { id: 'claude-3-5-haiku-20241022', name: 'Claude 3.5 Haiku', tag: 'Fast' },
        { id: 'claude-3-opus-20240229', name: 'Claude 3 Opus' },
        { id: 'claude-3-sonnet-20240229', name: 'Claude 3 Sonnet' },
        { id: 'claude-3-haiku-20240307', name: 'Claude 3 Haiku' },
      ]
    },
    gemini: {
      name: 'Google',
      icon: 'fa-gem',
      color: '#4285f4',
      keyName: 'geminiKey',
      models: [
        { id: 'gemini-2.5-flash-preview-05-20', name: 'Gemini 2.5 Flash', tag: 'LATEST' },
        { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash' },
        { id: 'gemini-2.0-flash-lite', name: 'Gemini 2.0 Flash Lite', tag: 'Fast' },
        { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro' },
        { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash' },
        { id: 'gemini-1.5-flash-8b', name: 'Gemini 1.5 Flash 8B', tag: 'Economy' },
      ]
    },
    grok: {
      name: 'xAI',
      icon: 'fab fa-x-twitter',
      color: '#ffffff',
      keyName: 'grokKey',
      models: [
        { id: 'grok-3', name: 'Grok 3', tag: 'LATEST' },
        { id: 'grok-3-fast', name: 'Grok 3 Fast', tag: 'Fast' },
        { id: 'grok-2-1212', name: 'Grok 2' },
        { id: 'grok-2-vision-1212', name: 'Grok 2 Vision', tag: 'Vision' },
        { id: 'grok-beta', name: 'Grok Beta' },
      ]
    },
    deepseek: {
      name: 'DeepSeek',
      icon: 'fa-fish',
      color: '#00b4d8',
      keyName: 'deepseekKey',
      models: [
        { id: 'deepseek-chat', name: 'DeepSeek V3', tag: 'LATEST' },
        { id: 'deepseek-reasoner', name: 'DeepSeek R1', tag: 'Reasoning' },
        { id: 'deepseek-coder', name: 'DeepSeek Coder', tag: 'Code' },
      ]
    },
    openrouter: {
      name: 'OpenRouter',
      icon: 'fa-route',
      color: '#a855f7',
      keyName: 'openrouterKey',
      models: [
        { id: 'openai/gpt-4o', name: 'GPT-4o', tag: 'HOT' },
        { id: 'openai/gpt-4o-mini', name: 'GPT-4o Mini', tag: 'Fast' },
        { id: 'openai/o1', name: 'o1', tag: 'Reasoning' },
        { id: 'openai/o1-mini', name: 'o1-mini' },
        { id: 'anthropic/claude-sonnet-4', name: 'Claude Sonnet 4', tag: 'HOT' },
        { id: 'anthropic/claude-3.5-sonnet', name: 'Claude 3.5 Sonnet' },
        { id: 'anthropic/claude-3.5-haiku', name: 'Claude 3.5 Haiku', tag: 'Fast' },
        { id: 'google/gemini-2.5-flash-preview', name: 'Gemini 2.5 Flash', tag: 'NEW' },
        { id: 'google/gemini-2.0-flash-001', name: 'Gemini 2.0 Flash' },
        { id: 'google/gemini-1.5-pro', name: 'Gemini 1.5 Pro' },
        { id: 'x-ai/grok-3', name: 'Grok 3', tag: 'NEW' },
        { id: 'deepseek/deepseek-chat', name: 'DeepSeek V3' },
        { id: 'deepseek/deepseek-r1', name: 'DeepSeek R1', tag: 'Reasoning' },
        { id: 'meta-llama/llama-3.3-70b-instruct', name: 'Llama 3.3 70B', tag: 'Open' },
        { id: 'mistralai/mistral-large-2411', name: 'Mistral Large' },
        { id: 'mistralai/codestral-latest', name: 'Codestral', tag: 'Code' },
        { id: 'qwen/qwen-2.5-72b-instruct', name: 'Qwen 2.5 72B' },
        { id: 'qwen/qwq-32b-preview', name: 'QwQ 32B', tag: 'Reasoning' },
        { id: 'perplexity/sonar-pro', name: 'Sonar Pro', tag: 'Search' },
        { id: 'cohere/command-r-plus-08-2024', name: 'Command R+' },
      ]
    },
    doubao: {
      name: '豆包',
      icon: 'fa-fire',
      color: '#ff6b6b',
      keyName: 'doubaoKey',
      models: [
        { id: 'doubao-1.5-pro-256k', name: '豆包 1.5 Pro 256K', tag: 'LATEST' },
        { id: 'doubao-1.5-pro-32k', name: '豆包 1.5 Pro 32K' },
        { id: 'doubao-1-5-lite-32k', name: '豆包 1.5 Lite 32K', tag: 'Fast' },
        { id: 'doubao-pro-256k', name: '豆包 Pro 256K' },
        { id: 'doubao-pro-128k', name: '豆包 Pro 128K' },
        { id: 'doubao-pro-32k', name: '豆包 Pro 32K' },
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
        { id: 'glm-4-plus', name: 'GLM-4 Plus', tag: 'LATEST' },
        { id: 'glm-4-0520', name: 'GLM-4' },
        { id: 'glm-4-flash', name: 'GLM-4 Flash', tag: 'Fast' },
        { id: 'glm-4-air', name: 'GLM-4 Air' },
        { id: 'glm-4-airx', name: 'GLM-4 AirX' },
        { id: 'glm-4-long', name: 'GLM-4 Long', tag: '1M Context' },
      ]
    }
  };

  // ==================== Application State ====================
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
    expandedProvider: null
  };

  // ==================== Storage Functions ====================
  function loadState() {
    try {
      const keys = localStorage.getItem(STORAGE_KEYS.API_KEYS);
      const channels = localStorage.getItem(STORAGE_KEYS.CHANNELS);
      const messages = localStorage.getItem(STORAGE_KEYS.MESSAGES);
      const gpts = localStorage.getItem(STORAGE_KEYS.GPTS);
      const imported = localStorage.getItem(STORAGE_KEYS.IMPORTED_CONTENT);
      const custom = localStorage.getItem(STORAGE_KEYS.CUSTOM_MODELS);
      const channel = localStorage.getItem(STORAGE_KEYS.CURRENT_CHANNEL);

      if (keys) state.apiKeys = JSON.parse(keys);
      if (channels) state.channels = JSON.parse(channels);
      if (messages) state.messages = JSON.parse(messages);
      if (gpts) state.gpts = JSON.parse(gpts);
      if (imported) state.importedContent = JSON.parse(imported);
      if (custom) state.customModels = JSON.parse(custom);
      if (channel) state.currentChannel = channel;
    } catch (e) {
      console.error('Error loading state:', e);
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEYS.API_KEYS, JSON.stringify(state.apiKeys));
      localStorage.setItem(STORAGE_KEYS.CHANNELS, JSON.stringify(state.channels));
      localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(state.messages));
      localStorage.setItem(STORAGE_KEYS.GPTS, JSON.stringify(state.gpts));
      localStorage.setItem(STORAGE_KEYS.IMPORTED_CONTENT, JSON.stringify(state.importedContent));
      localStorage.setItem(STORAGE_KEYS.CUSTOM_MODELS, JSON.stringify(state.customModels));
      localStorage.setItem(STORAGE_KEYS.CURRENT_CHANNEL, state.currentChannel);
    } catch (e) {
      console.error('Error saving state:', e);
    }
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
    if (!container) return;

    container.innerHTML = state.channels.map(ch => `
      <div class="channel-item ${ch.id === state.currentChannel ? 'active' : ''}" data-channel="${ch.id}">
        <i class="fas fa-hashtag text-slate-500 mr-2"></i>
        <span class="text-sm">${escapeHtml(ch.name)}</span>
      </div>
    `).join('');

    container.querySelectorAll('.channel-item').forEach(el => {
      el.addEventListener('click', () => switchChannel(el.dataset.channel));
    });

    const channelName = document.getElementById('currentChannelName');
    if (channelName) {
      const current = state.channels.find(c => c.id === state.currentChannel);
      channelName.textContent = current ? current.name : 'general';
    }
  }

  function renderModels() {
    const container = document.getElementById('modelList');
    if (!container) return;

    let html = '';
    Object.entries(AI_PROVIDERS).forEach(([providerKey, provider]) => {
      const hasKey = state.apiKeys[provider.keyName];
      const statusClass = hasKey ? 'online' : 'offline';
      const isExpanded = state.expandedProvider === providerKey;
      
      html += `
        <div class="provider-group mb-2">
          <div class="provider-header flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer hover:bg-slate-700/30 transition-all ${hasKey ? 'text-white' : 'text-slate-500'}" data-provider="${providerKey}">
            <div class="flex items-center gap-2">
              <span class="status-indicator ${statusClass}"></span>
              <i class="${provider.icon.startsWith('fab') ? provider.icon : 'fas ' + provider.icon}" style="color: ${provider.color}"></i>
              <span class="text-sm font-medium">${provider.name}</span>
            </div>
            <i class="fas fa-chevron-down text-xs text-slate-500 transition-transform ${isExpanded ? 'rotate-180' : ''}"></i>
          </div>
          <div class="provider-models pl-7 ${isExpanded ? '' : 'hidden'}">
            ${provider.models.slice(0, 6).map(m => `
              <div class="model-item flex items-center gap-2 px-3 py-1.5 text-xs text-slate-400 hover:text-white hover:bg-blue-500/10 rounded cursor-pointer transition-all" data-model="${m.id}" data-provider="${providerKey}">
                <span>@${m.id.split('/').pop()}</span>
                ${m.tag ? `<span class="provider-badge bg-${getTagColor(m.tag)}-500/20 text-${getTagColor(m.tag)}-400">${m.tag}</span>` : ''}
              </div>
            `).join('')}
            ${provider.models.length > 6 ? `<div class="text-xs text-slate-600 px-3 py-1">+${provider.models.length - 6} more</div>` : ''}
          </div>
        </div>
      `;
    });

    container.innerHTML = html;

    container.querySelectorAll('.provider-header').forEach(el => {
      el.addEventListener('click', () => {
        const provider = el.dataset.provider;
        state.expandedProvider = state.expandedProvider === provider ? null : provider;
        renderModels();
      });
    });

    container.querySelectorAll('.model-item').forEach(el => {
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        const modelId = el.dataset.model;
        const input = document.getElementById('messageInput');
        if (input) {
          const shortName = modelId.split('/').pop();
          input.value += `@${shortName} `;
          input.focus();
        }
      });
    });
  }

  function getTagColor(tag) {
    const colors = {
      'LATEST': 'green',
      'HOT': 'red',
      'NEW': 'blue',
      'Fast': 'cyan',
      'Reasoning': 'purple',
      'Vision': 'amber',
      'Code': 'emerald',
      'Search': 'orange',
      'Open': 'pink',
      'Hybrid': 'indigo'
    };
    return colors[tag] || 'slate';
  }

  function renderGpts() {
    const container = document.getElementById('gptsList');
    if (!container) return;

    if (state.gpts.length === 0) {
      container.innerHTML = '<div class="text-slate-500 text-xs">点击上方图标导入GPTs</div>';
      return;
    }

    container.innerHTML = state.gpts.map(gpt => `
      <div class="flex items-center gap-2 px-2 py-1.5 text-slate-300 cursor-pointer hover:bg-slate-700/30 rounded transition-all" title="${escapeHtml(gpt.description || '')}" data-gpt="${gpt.mention}">
        <span class="status-indicator online"></span>
        <i class="fas fa-magic text-purple-400 text-xs"></i>
        <span class="truncate text-sm">@${escapeHtml(gpt.mention)}</span>
      </div>
    `).join('');

    container.querySelectorAll('[data-gpt]').forEach(el => {
      el.addEventListener('click', () => {
        const input = document.getElementById('messageInput');
        if (input) {
          input.value += `@${el.dataset.gpt} `;
          input.focus();
        }
      });
    });
  }

  function renderImportedContent() {
    const container = document.getElementById('importedContent');
    if (!container) return;

    if (state.importedContent.length === 0) {
      container.innerHTML = '<div class="text-slate-500 text-xs">点击上方图标导入内容</div>';
      return;
    }

    container.innerHTML = state.importedContent.map((item, idx) => `
      <div class="flex items-center justify-between gap-2 px-2 py-1.5 text-slate-300 group">
        <div class="flex items-center gap-2 truncate cursor-pointer hover:text-white transition-all" data-content="${item.mention}">
          <i class="fas ${item.source === 'getnote' ? 'fa-sticky-note text-yellow-400' : item.source === 'notebooklm' ? 'fa-book text-blue-400' : 'fa-file text-slate-400'} text-xs"></i>
          <span class="truncate text-sm" title="${escapeHtml(item.name)}">@${escapeHtml(item.mention)}</span>
        </div>
        <button class="hidden group-hover:flex w-6 h-6 items-center justify-center text-slate-500 hover:text-red-400 transition-all" data-remove="${idx}">
          <i class="fas fa-times text-xs"></i>
        </button>
      </div>
    `).join('');

    container.querySelectorAll('[data-content]').forEach(el => {
      el.addEventListener('click', () => {
        const input = document.getElementById('messageInput');
        if (input) {
          input.value += `@${el.dataset.content} `;
          input.focus();
        }
      });
    });

    container.querySelectorAll('[data-remove]').forEach(el => {
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        const idx = parseInt(el.dataset.remove);
        state.importedContent.splice(idx, 1);
        saveState();
        renderImportedContent();
        showToast('内容已删除', 'success');
      });
    });
  }

  function renderMessages() {
    const container = document.getElementById('messagesArea');
    if (!container) return;

    const messages = state.messages[state.currentChannel] || [];

    if (messages.length === 0) {
      container.innerHTML = `
        <div class="flex flex-col items-center justify-center h-full text-center max-w-md mx-auto">
          <div class="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-6 shadow-2xl shadow-blue-500/30">
            <i class="fas fa-comments text-4xl text-white"></i>
          </div>
          <h3 class="text-2xl font-bold text-white mb-3">开始智能对话</h3>
          <p class="text-slate-400 mb-6">输入 <code class="bg-slate-700 px-2 py-1 rounded text-blue-400 font-mono">@</code> 选择AI模型开始协作</p>
          <div class="flex flex-wrap gap-2 justify-center">
            <span class="px-3 py-1.5 rounded-full bg-green-500/20 text-green-400 text-sm">@gpt-5.2</span>
            <span class="px-3 py-1.5 rounded-full bg-orange-500/20 text-orange-400 text-sm">@claude-opus-4.5</span>
            <span class="px-3 py-1.5 rounded-full bg-blue-500/20 text-blue-400 text-sm">@gemini-3-pro</span>
          </div>
        </div>
      `;
      return;
    }

    container.innerHTML = '<div class="space-y-6">' + messages.map(msg => renderMessage(msg)).join('') + '</div>';
    container.scrollTop = container.scrollHeight;
  }

  function renderMessage(msg) {
    const isUser = msg.role === 'user';
    const providerInfo = getProviderForModel(msg.model);
    
    let content = msg.content || '';
    if (!isUser && typeof marked !== 'undefined' && typeof DOMPurify !== 'undefined') {
      try {
        content = DOMPurify.sanitize(marked.parse(content));
      } catch (e) {
        content = escapeHtml(content);
      }
    } else {
      content = escapeHtml(content);
    }

    let attachmentHtml = '';
    if (msg.attachment) {
      if (msg.attachment.type === 'image') {
        attachmentHtml = `
          <div class="mt-3 p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
            <img src="${msg.attachment.data}" alt="${escapeHtml(msg.attachment.name)}" class="max-h-48 rounded-lg" />
          </div>
        `;
      } else if (msg.attachment.type === 'url') {
        attachmentHtml = `
          <div class="mt-3 p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
            <div class="text-xs text-blue-400 mb-1"><i class="fas fa-link mr-1"></i>${escapeHtml(msg.attachment.url)}</div>
            <div class="text-sm text-slate-400 line-clamp-3">${escapeHtml((msg.attachment.content || '').substring(0, 300))}...</div>
          </div>
        `;
      } else {
        attachmentHtml = `
          <div class="mt-3 p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 flex items-center gap-3">
            <i class="fas fa-file text-2xl text-slate-400"></i>
            <div>
              <div class="text-sm font-medium text-white">${escapeHtml(msg.attachment.name)}</div>
              <div class="text-xs text-slate-500">${escapeHtml(msg.attachment.type)}</div>
            </div>
          </div>
        `;
      }
    }

    if (msg.context) {
      attachmentHtml += `
        <div class="mt-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30">
          <div class="text-xs text-amber-400 mb-1"><i class="fas fa-quote-left mr-1"></i>引用: ${escapeHtml(msg.context.name)}</div>
          <div class="text-sm text-slate-300 line-clamp-3">${escapeHtml((msg.context.content || '').substring(0, 300))}...</div>
        </div>
      `;
    }

    const avatarBg = isUser ? 'bg-gradient-to-br from-blue-500 to-cyan-400' : `bg-[${providerInfo?.color || '#475569'}]`;
    const avatarIcon = isUser ? '<span class="font-bold text-white">T</span>' : getModelIcon(msg.model);

    return `
      <div class="message animate-fadeIn flex gap-4 ${isUser ? '' : ''}">
        <div class="w-10 h-10 rounded-xl ${avatarBg} flex items-center justify-center shrink-0 shadow-lg" style="${!isUser && providerInfo ? `background-color: ${providerInfo.color}` : ''}">
          ${avatarIcon}
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-3 mb-1">
            <span class="font-semibold text-white">${isUser ? 'Tony' : getModelDisplayName(msg.model)}</span>
            ${!isUser && msg.model ? `<span class="provider-badge" style="background-color: ${providerInfo?.color}20; color: ${providerInfo?.color}">@${msg.model}</span>` : ''}
            <span class="text-xs text-slate-500">${formatTime(msg.timestamp)}</span>
          </div>
          <div class="msg-content text-slate-200">${content}</div>
          ${attachmentHtml}
        </div>
      </div>
    `;
  }

  function getProviderForModel(modelId) {
    if (!modelId) return null;
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
        return `<i class="${provider.icon} text-white"></i>`;
      }
      return `<i class="fas ${provider.icon} text-white"></i>`;
    }
    return '<i class="fas fa-robot text-white"></i>';
  }

  function getModelDisplayName(modelId) {
    if (!modelId) return 'AI';
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

  // ==================== Mention System ====================
  function showMentions(filter = '') {
    const dropdown = document.getElementById('mentionsDropdown');
    if (!dropdown) return;

    const filterLower = filter.toLowerCase();
    let html = '';
    
    Object.entries(AI_PROVIDERS).forEach(([providerKey, provider]) => {
      const hasKey = state.apiKeys[provider.keyName];
      if (!hasKey) return;

      const matchingModels = provider.models.filter(m => 
        m.id.toLowerCase().includes(filterLower) ||
        m.name.toLowerCase().includes(filterLower) ||
        providerKey.includes(filterLower)
      );

      if (matchingModels.length === 0 && !providerKey.includes(filterLower) && !provider.name.toLowerCase().includes(filterLower)) {
        return;
      }

      const displayModels = filterLower ? matchingModels : provider.models;

      html += `
        <div class="mention-provider">
          <div class="px-4 py-2.5 flex items-center gap-2 text-sm font-semibold border-b border-slate-700/50" style="color: ${provider.color}">
            <i class="${provider.icon.startsWith('fab') ? provider.icon : 'fas ' + provider.icon}"></i>
            ${provider.name}
            <span class="text-xs text-slate-500 font-normal">${displayModels.length} models</span>
          </div>
          <div class="py-1">
            ${displayModels.map(m => `
              <div class="mention-item px-4 py-2 flex items-center justify-between hover:bg-blue-500/10 cursor-pointer transition-all" data-model="${m.id}" data-provider="${providerKey}">
                <div class="flex items-center gap-2">
                  <span class="text-white font-medium">@${m.id.split('/').pop()}</span>
                  <span class="text-xs text-slate-500">${m.name}</span>
                </div>
                ${m.tag ? `<span class="provider-badge bg-${getTagColor(m.tag)}-500/20 text-${getTagColor(m.tag)}-400">${m.tag}</span>` : ''}
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
          <div class="px-4 py-2.5 flex items-center gap-2 text-sm font-semibold border-b border-slate-700/50 text-purple-400">
            <i class="fas fa-magic"></i>我的GPTs
          </div>
          <div class="py-1">
            ${matchingGpts.map(g => `
              <div class="mention-item px-4 py-2 flex items-center gap-2 hover:bg-purple-500/10 cursor-pointer transition-all" data-gpt="${g.mention}">
                <span class="text-white font-medium">@${g.mention}</span>
                <span class="text-xs text-slate-500">${escapeHtml(g.name)}</span>
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
          <div class="px-4 py-2.5 flex items-center gap-2 text-sm font-semibold border-b border-slate-700/50 text-amber-400">
            <i class="fas fa-file-import"></i>导入内容
          </div>
          <div class="py-1">
            ${matchingContent.map(i => `
              <div class="mention-item px-4 py-2 flex items-center gap-2 hover:bg-amber-500/10 cursor-pointer transition-all" data-content="${i.mention}">
                <span class="text-white font-medium">@${i.mention}</span>
                <span class="text-xs text-slate-500">${escapeHtml(i.name)}</span>
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
          <div class="px-4 py-2.5 flex items-center gap-2 text-sm font-semibold border-b border-slate-700/50 text-pink-400">
            <i class="fas fa-cog"></i>自定义模型
          </div>
          <div class="py-1">
            ${matchingCustom.map(m => `
              <div class="mention-item px-4 py-2 flex items-center gap-2 hover:bg-pink-500/10 cursor-pointer transition-all" data-custom="${m.mention}">
                <span class="text-white font-medium">@${m.mention}</span>
                <span class="text-xs text-slate-500">${escapeHtml(m.name)}</span>
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

    dropdown.querySelectorAll('.mention-item').forEach(el => {
      el.addEventListener('click', () => {
        const model = el.dataset.model || el.dataset.gpt || el.dataset.content || el.dataset.custom;
        if (model) {
          insertMention(model.split('/').pop());
        }
      });
    });
  }

  function hideMentions() {
    const dropdown = document.getElementById('mentionsDropdown');
    if (dropdown) {
      dropdown.classList.add('hidden');
    }
  }

  function insertMention(mention) {
    const input = document.getElementById('messageInput');
    if (!input) return;

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
    if (!input) return;

    const text = input.value.trim();
    
    if (!text && !state.currentAttachment) {
      return;
    }

    // Parse mentions
    const mentionRegex = /@([\w\-\.\/]+)/g;
    const mentions = [...text.matchAll(mentionRegex)].map(m => m[1]);
    
    // Find valid AI mentions
    const aiMentions = [];
    mentions.forEach(m => {
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
    
    // Find context mentions
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
    input.style.height = 'auto';
    clearAttachment();

    if (aiMentions.length === 0) {
      showToast('提示: 使用 @ 选择AI模型来获取回复', 'info');
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
    if (!container) return;

    const existingIndicator = document.getElementById('typingIndicator');
    if (existingIndicator) existingIndicator.remove();

    const indicator = document.createElement('div');
    indicator.id = 'typingIndicator';
    indicator.className = 'message animate-fadeIn flex gap-4 mt-6';
    indicator.innerHTML = `
      <div class="w-10 h-10 rounded-xl bg-slate-600 flex items-center justify-center shrink-0">
        ${getModelIcon(model)}
      </div>
      <div class="flex-1">
        <div class="flex items-center gap-3 mb-2">
          <span class="font-semibold text-white">${getModelDisplayName(model)}</span>
          <span class="text-xs text-slate-500">正在输入...</span>
        </div>
        <div class="flex gap-1.5">
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
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
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    
    if (file.type.startsWith('image/')) {
      reader.onload = (e) => {
        state.currentAttachment = {
          type: 'image',
          name: file.name,
          data: e.target?.result
        };
        showFilePreview();
      };
      reader.readAsDataURL(file);
    } else {
      reader.onload = (e) => {
        state.currentAttachment = {
          type: file.type || 'file',
          name: file.name,
          content: e.target?.result
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
    const imageContainer = document.getElementById('imagePreviewContainer');
    const imagePreview = document.getElementById('imagePreview');

    if (!preview || !fileName || !fileIcon) return;

    preview.classList.remove('hidden');
    fileName.textContent = state.currentAttachment?.name || '';

    if (state.currentAttachment?.type === 'image') {
      fileIcon.className = 'fas fa-image text-blue-400';
      if (imageContainer && imagePreview) {
        imageContainer.classList.remove('hidden');
        imagePreview.src = state.currentAttachment.data;
      }
    } else {
      fileIcon.className = 'fas fa-file text-blue-400';
      if (imageContainer) {
        imageContainer.classList.add('hidden');
      }
    }
  }

  function clearAttachment() {
    state.currentAttachment = null;
    const preview = document.getElementById('filePreview');
    const fileInput = document.getElementById('fileInput');
    if (preview) preview.classList.add('hidden');
    if (fileInput) fileInput.value = '';
  }

  // ==================== URL Handling ====================
  async function fetchUrlContent() {
    const urlInput = document.getElementById('urlInput');
    const url = urlInput?.value?.trim();

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
      const fileName = document.getElementById('fileName');
      const fileIcon = document.getElementById('fileIcon');
      if (fileName) fileName.textContent = url;
      if (fileIcon) fileIcon.className = 'fas fa-link text-blue-400';
      
      closeModal('urlModal');
      if (urlInput) urlInput.value = '';
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

    const id = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    if (state.channels.find(c => c.id === id)) {
      showToast('频道已存在', 'error');
      return;
    }

    state.channels.push({ id, name, desc: '' });
    state.messages[id] = [];
    saveState();
    renderChannels();
    switchChannel(id);
    showToast('频道已创建', 'success');
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
        method: 'POST',
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
    const nameEl = document.getElementById('importContentName');
    const sourceEl = document.getElementById('importContentSource');
    const textEl = document.getElementById('importContentText');

    const name = nameEl?.value?.trim();
    const source = sourceEl?.value;
    const content = textEl?.value?.trim();

    if (!name || !content) {
      showToast('请填写名称和内容', 'error');
      return;
    }

    const mention = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').substring(0, 20);
    
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
    
    if (nameEl) nameEl.value = '';
    if (textEl) textEl.value = '';
    
    showToast(`内容已导入，使用 @${mention} 引用`, 'success');
  }

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
      version: '3.0',
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
    const file = event.target?.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result);
        
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
    const nameEl = document.getElementById('customModelName');
    const endpointEl = document.getElementById('customModelEndpoint');
    const modelIdEl = document.getElementById('customModelId');
    const apiKeyEl = document.getElementById('customModelKey');

    const name = nameEl?.value?.trim();
    const endpoint = endpointEl?.value?.trim();
    const modelId = modelIdEl?.value?.trim();
    const apiKey = apiKeyEl?.value?.trim();

    if (!name || !endpoint) {
      showToast('请填写模型名称和API端点', 'error');
      return;
    }

    const mention = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    
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
    
    if (nameEl) nameEl.value = '';
    if (endpointEl) endpointEl.value = '';
    if (modelIdEl) modelIdEl.value = '';
    if (apiKeyEl) apiKeyEl.value = '';
    
    showToast(`自定义模型已添加，使用 @${mention} 调用`, 'success');
  }

  function renderCustomModels() {
    const container = document.getElementById('customModelsList');
    if (!container) return;

    if (state.customModels.length === 0) {
      container.innerHTML = '<div class="text-slate-500 text-sm py-2">暂无自定义模型</div>';
      return;
    }

    container.innerHTML = state.customModels.map((model, idx) => `
      <div class="flex items-center justify-between p-3 glass-light rounded-xl">
        <div>
          <div class="font-medium text-white">@${escapeHtml(model.mention)}</div>
          <div class="text-xs text-slate-500">${escapeHtml(model.endpoint)}</div>
        </div>
        <button class="w-8 h-8 rounded-lg hover:bg-red-500/20 flex items-center justify-center text-slate-400 hover:text-red-400 transition-all" data-remove-custom="${idx}">
          <i class="fas fa-trash text-sm"></i>
        </button>
      </div>
    `).join('');

    container.querySelectorAll('[data-remove-custom]').forEach(el => {
      el.addEventListener('click', () => {
        const idx = parseInt(el.dataset.removeCustom);
        state.customModels.splice(idx, 1);
        saveState();
        renderCustomModels();
        showToast('自定义模型已删除', 'success');
      });
    });
  }

  // ==================== Utilities ====================
  function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function formatTime(isoString) {
    if (!isoString) return '';
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
    const existingToasts = document.querySelectorAll('.toast');
    existingToasts.forEach(t => t.remove());

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'} mr-2"></i>${escapeHtml(message)}`;
    document.body.appendChild(toast);
    
    setTimeout(() => toast.remove(), 3500);
  }

  function openModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.remove('hidden');
  }

  function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.add('hidden');
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
    const sendBtn = document.getElementById('sendBtn');

    if (messageInput) {
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
    }

    if (sendBtn) {
      sendBtn.addEventListener('click', sendMessage);
    }

    const fileInput = document.getElementById('fileInput');
    if (fileInput) {
      fileInput.addEventListener('change', handleFileSelect);
    }

    const removeFile = document.getElementById('removeFile');
    if (removeFile) {
      removeFile.addEventListener('click', clearAttachment);
    }

    const urlBtn = document.getElementById('urlBtn');
    if (urlBtn) {
      urlBtn.addEventListener('click', () => openModal('urlModal'));
    }

    const fetchUrl = document.getElementById('fetchUrl');
    if (fetchUrl) {
      fetchUrl.addEventListener('click', fetchUrlContent);
    }

    const closeUrlModal = document.getElementById('closeUrlModal');
    if (closeUrlModal) {
      closeUrlModal.addEventListener('click', () => closeModal('urlModal'));
    }

    const newChannelBtn = document.getElementById('newChannelBtn');
    if (newChannelBtn) {
      newChannelBtn.addEventListener('click', createNewChannel);
    }

    const settingsBtn = document.getElementById('settingsBtn');
    if (settingsBtn) {
      settingsBtn.addEventListener('click', () => {
        loadApiKeysToForm();
        renderCustomModels();
        openModal('settingsModal');
      });
    }

    const closeSettings = document.getElementById('closeSettings');
    if (closeSettings) {
      closeSettings.addEventListener('click', () => closeModal('settingsModal'));
    }

    const saveApiKeysBtn = document.getElementById('saveApiKeys');
    if (saveApiKeysBtn) {
      saveApiKeysBtn.addEventListener('click', saveApiKeys);
    }

    document.querySelectorAll('.settings-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.settings-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.settings-content').forEach(c => c.classList.add('hidden'));
        tab.classList.add('active');
        const tabEl = document.getElementById(tab.dataset.tab + 'Tab');
        if (tabEl) tabEl.classList.remove('hidden');
      });
    });

    const importGptsBtn = document.getElementById('importGptsBtn');
    if (importGptsBtn) {
      importGptsBtn.addEventListener('click', importGpts);
    }

    const importContentBtn = document.getElementById('importContentBtn');
    if (importContentBtn) {
      importContentBtn.addEventListener('click', () => openModal('importContentModal'));
    }

    const closeImportContent = document.getElementById('closeImportContent');
    if (closeImportContent) {
      closeImportContent.addEventListener('click', () => closeModal('importContentModal'));
    }

    const saveImportContentBtn = document.getElementById('saveImportContent');
    if (saveImportContentBtn) {
      saveImportContentBtn.addEventListener('click', saveImportContent);
    }

    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
      exportBtn.addEventListener('click', exportToMarkdown);
    }

    const clearChatBtn = document.getElementById('clearChatBtn');
    if (clearChatBtn) {
      clearChatBtn.addEventListener('click', () => {
        if (!confirm('确定要清空当前频道的对话吗？')) return;
        state.messages[state.currentChannel] = [];
        saveState();
        renderMessages();
        showToast('对话已清空', 'success');
      });
    }

    const exportAllDataBtn = document.getElementById('exportAllData');
    if (exportAllDataBtn) {
      exportAllDataBtn.addEventListener('click', exportAllData);
    }

    const importDataFile = document.getElementById('importDataFile');
    if (importDataFile) {
      importDataFile.addEventListener('change', importData);
    }

    const clearAllDataBtn = document.getElementById('clearAllData');
    if (clearAllDataBtn) {
      clearAllDataBtn.addEventListener('click', clearAllData);
    }

    const addCustomModelBtn = document.getElementById('addCustomModel');
    if (addCustomModelBtn) {
      addCustomModelBtn.addEventListener('click', addCustomModel);
    }

    // Close modals on backdrop click
    document.querySelectorAll('.fixed.inset-0').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.add('hidden');
        }
      });
    });

    // Close mentions on outside click
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

    // Configure marked if available
    if (typeof marked !== 'undefined') {
      marked.setOptions({
        breaks: true,
        gfm: true
      });
    }

    console.log('AI Team Hub v3.0 initialized');
  }

  // Start the app
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
