// AI Team Hub - Main Application
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

  // Built-in AI Models
  const AI_MODELS = {
    'gpt4o': { name: 'GPT-4o', provider: 'openai', model: 'gpt-4o', icon: 'fa-robot', color: 'openai' },
    'gpt4': { name: 'GPT-4', provider: 'openai', model: 'gpt-4-turbo', icon: 'fa-robot', color: 'openai' },
    'gpt3.5': { name: 'GPT-3.5', provider: 'openai', model: 'gpt-3.5-turbo', icon: 'fa-robot', color: 'openai' },
    'o1': { name: 'o1', provider: 'openai', model: 'o1', icon: 'fa-brain', color: 'openai' },
    'o1-mini': { name: 'o1-mini', provider: 'openai', model: 'o1-mini', icon: 'fa-brain', color: 'openai' },
    'claude': { name: 'Claude 3.5', provider: 'claude', model: 'claude-3-5-sonnet-20241022', icon: 'fa-cloud', color: 'claude' },
    'claude-opus': { name: 'Claude Opus', provider: 'claude', model: 'claude-3-opus-20240229', icon: 'fa-cloud', color: 'claude' },
    'claude-haiku': { name: 'Claude Haiku', provider: 'claude', model: 'claude-3-5-haiku-20241022', icon: 'fa-cloud', color: 'claude' },
    'gemini': { name: 'Gemini Pro', provider: 'gemini', model: 'gemini-1.5-pro', icon: 'fa-gem', color: 'gemini' },
    'gemini-flash': { name: 'Gemini Flash', provider: 'gemini', model: 'gemini-1.5-flash', icon: 'fa-gem', color: 'gemini' },
    'grok': { name: 'Grok', provider: 'grok', model: 'grok-beta', icon: 'fab fa-x-twitter', color: 'grok' },
    'deepseek': { name: 'DeepSeek', provider: 'deepseek', model: 'deepseek-chat', icon: 'fa-fish', color: 'deepseek' },
    'deepseek-coder': { name: 'DeepSeek Coder', provider: 'deepseek', model: 'deepseek-coder', icon: 'fa-code', color: 'deepseek' },
    'doubao': { name: '豆包', provider: 'doubao', model: 'doubao-pro-32k', icon: 'fa-fire', color: 'doubao' },
    'qwen': { name: '通义千问', provider: 'qwen', model: 'qwen-max', icon: 'fa-cloud-sun', color: 'qwen' },
    'qwen-turbo': { name: '千问Turbo', provider: 'qwen', model: 'qwen-turbo', icon: 'fa-cloud-sun', color: 'qwen' },
    'kimi': { name: 'Kimi', provider: 'kimi', model: 'moonshot-v1-128k', icon: 'fa-moon', color: 'kimi' },
    'glm': { name: '智谱GLM', provider: 'glm', model: 'glm-4', icon: 'fa-brain', color: 'glm' },
    'glm-flash': { name: 'GLM Flash', provider: 'glm', model: 'glm-4-flash', icon: 'fa-brain', color: 'glm' }
  };

  // Provider to API key mapping
  const PROVIDER_KEY_MAP = {
    'openai': 'openaiKey',
    'claude': 'claudeKey',
    'gemini': 'geminiKey',
    'grok': 'grokKey',
    'deepseek': 'deepseekKey',
    'doubao': 'doubaoKey',
    'qwen': 'qwenKey',
    'kimi': 'kimiKey',
    'glm': 'glmKey'
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
    mentionIndex: -1
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

  // ==================== Encryption (Simple Base64 for demo) ====================
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

    // Add click handlers
    container.querySelectorAll('.channel-item').forEach(el => {
      el.addEventListener('click', () => switchChannel(el.dataset.channel));
    });

    document.getElementById('currentChannelName').textContent = state.channels.find(c => c.id === state.currentChannel)?.name || 'general';
  }

  function renderModels() {
    const container = document.getElementById('modelList');
    const availableModels = Object.entries(AI_MODELS).filter(([key, model]) => {
      const keyName = PROVIDER_KEY_MAP[model.provider];
      return state.apiKeys[keyName];
    });

    if (availableModels.length === 0) {
      container.innerHTML = '<div class="text-gray-500 text-xs px-2">请先在设置中配置API Keys</div>';
      return;
    }

    container.innerHTML = availableModels.map(([key, model]) => `
      <div class="flex items-center gap-2 px-2 py-1 text-gray-300">
        <span class="status-dot online"></span>
        <i class="fas ${model.icon.startsWith('fab') ? '' : 'fas '}${model.icon}"></i>
        <span>@${key}</span>
      </div>
    `).join('');
  }

  function renderGpts() {
    const container = document.getElementById('gptsList');
    if (state.gpts.length === 0) {
      container.innerHTML = '<div class="text-gray-500 text-xs px-2">点击上方图标导入GPTs</div>';
      return;
    }

    container.innerHTML = state.gpts.map(gpt => `
      <div class="flex items-center gap-2 px-2 py-1 text-gray-300" title="${gpt.description || ''}">
        <span class="status-dot online"></span>
        <i class="fas fa-magic text-purple-400"></i>
        <span class="truncate">@${gpt.mention}</span>
      </div>
    `).join('');
  }

  function renderImportedContent() {
    const container = document.getElementById('importedContent');
    if (state.importedContent.length === 0) {
      container.innerHTML = '<div class="text-gray-500 text-xs px-2">点击上方图标导入内容</div>';
      return;
    }

    container.innerHTML = state.importedContent.map((item, idx) => `
      <div class="flex items-center justify-between gap-2 px-2 py-1 text-gray-300 group">
        <div class="flex items-center gap-2 truncate">
          <i class="fas ${item.source === 'getnote' ? 'fa-sticky-note text-yellow-400' : item.source === 'notebooklm' ? 'fa-book text-blue-400' : 'fa-file text-gray-400'}"></i>
          <span class="truncate" title="${item.name}">@${item.mention}</span>
        </div>
        <button class="hidden group-hover:block text-gray-500 hover:text-red-400" onclick="removeImportedContent(${idx})">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `).join('');
  }

  function renderMessages() {
    const container = document.getElementById('messagesArea');
    const messages = state.messages[state.currentChannel] || [];

    if (messages.length === 0) {
      container.innerHTML = `
        <div class="text-center text-gray-500 py-8">
          <i class="fas fa-comments text-4xl mb-4"></i>
          <p>开始与AI团队对话</p>
          <p class="text-sm mt-2">使用 @模型名 来指定AI回答，例如: @gpt4o 你好</p>
        </div>
      `;
      return;
    }

    container.innerHTML = messages.map(msg => renderMessage(msg)).join('');
    container.scrollTop = container.scrollHeight;
  }

  function renderMessage(msg) {
    const isUser = msg.role === 'user';
    const modelInfo = AI_MODELS[msg.model] || state.customModels.find(m => m.mention === msg.model) || { color: 'custom' };
    
    let content = msg.content;
    if (!isUser) {
      // Render markdown for AI responses
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

    return `
      <div class="message ${isUser ? 'user' : 'ai ' + modelInfo.color} fade-in">
        <div class="message-avatar ${isUser ? '' : modelInfo.color}">
          ${isUser ? '<i class="fas fa-user"></i>' : getModelIcon(msg.model)}
        </div>
        <div class="message-content">
          <div class="message-header">
            <span class="message-author">${isUser ? 'Tony' : getModelDisplayName(msg.model)}</span>
            ${!isUser ? `<span class="model-badge ${modelInfo.color}">@${msg.model}</span>` : ''}
            <span class="message-time">${formatTime(msg.timestamp)}</span>
          </div>
          <div class="message-body">${content}</div>
          ${attachmentHtml}
        </div>
      </div>
    `;
  }

  function getModelIcon(modelKey) {
    const model = AI_MODELS[modelKey];
    if (model) {
      if (model.icon.startsWith('fab')) {
        return `<i class="${model.icon}"></i>`;
      }
      return `<i class="fas ${model.icon}"></i>`;
    }
    
    const gpt = state.gpts.find(g => g.mention === modelKey);
    if (gpt) return '<i class="fas fa-magic"></i>';
    
    const imported = state.importedContent.find(i => i.mention === modelKey);
    if (imported) return '<i class="fas fa-file-import"></i>';
    
    const custom = state.customModels.find(m => m.mention === modelKey);
    if (custom) return '<i class="fas fa-cog"></i>';
    
    return '<i class="fas fa-robot"></i>';
  }

  function getModelDisplayName(modelKey) {
    const model = AI_MODELS[modelKey];
    if (model) return model.name;
    
    const gpt = state.gpts.find(g => g.mention === modelKey);
    if (gpt) return gpt.name;
    
    const imported = state.importedContent.find(i => i.mention === modelKey);
    if (imported) return imported.name;
    
    const custom = state.customModels.find(m => m.mention === modelKey);
    if (custom) return custom.name;
    
    return modelKey;
  }

  // ==================== Mention System ====================
  function showMentions(filter = '') {
    const dropdown = document.getElementById('mentionsDropdown');
    const items = getAllMentionable().filter(item => 
      item.mention.toLowerCase().includes(filter.toLowerCase()) ||
      item.name.toLowerCase().includes(filter.toLowerCase())
    );

    if (items.length === 0) {
      dropdown.classList.add('hidden');
      return;
    }

    dropdown.innerHTML = items.map((item, idx) => `
      <div class="mention-item ${idx === state.mentionIndex ? 'selected' : ''}" data-mention="${item.mention}">
        <div class="model-icon ${item.color}" style="background-color: ${getColorForType(item.type)}">
          ${item.icon}
        </div>
        <div>
          <div class="font-medium">@${item.mention}</div>
          <div class="text-xs text-gray-400">${item.name}</div>
        </div>
      </div>
    `).join('');

    dropdown.classList.remove('hidden');

    // Add click handlers
    dropdown.querySelectorAll('.mention-item').forEach(el => {
      el.addEventListener('click', () => insertMention(el.dataset.mention));
    });
  }

  function hideMentions() {
    document.getElementById('mentionsDropdown').classList.add('hidden');
    state.mentionIndex = -1;
  }

  function getAllMentionable() {
    const items = [];

    // AI Models with available keys
    Object.entries(AI_MODELS).forEach(([key, model]) => {
      const keyName = PROVIDER_KEY_MAP[model.provider];
      if (state.apiKeys[keyName]) {
        items.push({
          mention: key,
          name: model.name,
          type: 'model',
          color: model.color,
          icon: `<i class="fas ${model.icon}"></i>`
        });
      }
    });

    // GPTs
    state.gpts.forEach(gpt => {
      items.push({
        mention: gpt.mention,
        name: gpt.name,
        type: 'gpt',
        color: 'gpt',
        icon: '<i class="fas fa-magic"></i>'
      });
    });

    // Imported Content
    state.importedContent.forEach(item => {
      items.push({
        mention: item.mention,
        name: item.name,
        type: 'imported',
        color: 'imported',
        icon: '<i class="fas fa-file-import"></i>'
      });
    });

    // Custom Models
    state.customModels.forEach(model => {
      items.push({
        mention: model.mention,
        name: model.name,
        type: 'custom',
        color: 'custom',
        icon: '<i class="fas fa-cog"></i>'
      });
    });

    return items;
  }

  function getColorForType(type) {
    const colors = {
      model: '#4a154b',
      gpt: '#74aa9c',
      imported: '#f59e0b',
      custom: '#ec4899'
    };
    return colors[type] || '#6b7280';
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

    // Parse mentions
    const mentionRegex = /@(\w+[-]?\w*)/g;
    const mentions = [...text.matchAll(mentionRegex)].map(m => m[1]);
    
    // Find valid AI mentions
    const aiMentions = mentions.filter(m => {
      return AI_MODELS[m] || state.gpts.find(g => g.mention === m) || state.customModels.find(c => c.mention === m);
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

    // Add to state
    if (!state.messages[state.currentChannel]) {
      state.messages[state.currentChannel] = [];
    }
    state.messages[state.currentChannel].push(userMessage);
    saveState();
    renderMessages();

    // Clear input
    input.value = '';
    clearAttachment();

    // If no AI mentioned, use default or show hint
    if (aiMentions.length === 0) {
      showToast('提示: 使用 @模型名 来指定AI回答', 'info');
      return;
    }

    // Send to each mentioned AI
    for (const mention of aiMentions) {
      await callAI(mention, text, userMessage);
    }
  }

  async function callAI(mention, userText, userMessage) {
    // Show typing indicator
    showTypingIndicator(mention);

    try {
      let response;
      
      // Check if it's a GPT
      const gpt = state.gpts.find(g => g.mention === mention);
      if (gpt) {
        response = await callGPT(gpt, userText, userMessage);
      }
      // Check if it's a custom model
      else if (state.customModels.find(m => m.mention === mention)) {
        const custom = state.customModels.find(m => m.mention === mention);
        response = await callCustomModel(custom, userText, userMessage);
      }
      // Built-in model
      else {
        const model = AI_MODELS[mention];
        if (!model) throw new Error('Unknown model');
        response = await callBuiltInModel(model, mention, userText, userMessage);
      }

      // Add AI response
      const aiMessage = {
        id: Date.now(),
        role: 'assistant',
        model: mention,
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
        model: mention,
        content: `**错误**: ${error.message}\n\n请检查:\n1. API Key 是否正确配置\n2. 网络连接是否正常\n3. API 额度是否充足`,
        timestamp: new Date().toISOString()
      };

      state.messages[state.currentChannel].push(errorMessage);
      saveState();
    }

    hideTypingIndicator();
    renderMessages();
  }

  async function callBuiltInModel(model, mention, userText, userMessage) {
    const keyName = PROVIDER_KEY_MAP[model.provider];
    const apiKey = decryptKey(state.apiKeys[keyName]);

    if (!apiKey) {
      throw new Error(`请先配置 ${model.name} 的 API Key`);
    }

    // Build messages array with context
    const messages = buildMessageHistory(userText, userMessage);

    const response = await fetch(`/api/proxy/${model.provider}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey
      },
      body: JSON.stringify({
        model: model.model,
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

  async function callGPT(gpt, userText, userMessage) {
    const apiKey = decryptKey(state.apiKeys.openaiKey);
    if (!apiKey) throw new Error('请先配置 OpenAI API Key');

    // Use Assistants API for GPTs
    const response = await fetch('/api/proxy/openai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: buildMessageHistory(userText, userMessage),
        max_tokens: 4096
      })
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error.message || data.error);
    
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
    
    // Get recent history (last 10 messages)
    const recentMessages = channelMessages.slice(-10);
    
    for (const msg of recentMessages) {
      if (msg.role === 'user') {
        let content = msg.content;
        
        // Add context if available
        if (msg.context) {
          content = `[引用内容: ${msg.context.name}]\n${msg.context.content}\n\n用户问题: ${content}`;
        }
        
        // Add attachment info
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
      <div class="message-avatar">
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
      document.getElementById('fileIcon').className = 'fas fa-link text-slack-blue';
      
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
        showToast('未找到GPTs，请确保您的账户有创建的Assistants', 'info');
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
    
    showToast('内容已导入，使用 @' + mention + ' 在对话中引用', 'success');
  }

  window.removeImportedContent = function(index) {
    state.importedContent.splice(index, 1);
    saveState();
    renderImportedContent();
    showToast('内容已删除', 'success');
  };

  // ==================== Settings ====================
  function loadApiKeysToForm() {
    Object.keys(PROVIDER_KEY_MAP).forEach(provider => {
      const keyName = PROVIDER_KEY_MAP[provider];
      const input = document.getElementById(keyName);
      if (input && state.apiKeys[keyName]) {
        input.value = decryptKey(state.apiKeys[keyName]);
      }
    });
  }

  function saveApiKeys() {
    Object.keys(PROVIDER_KEY_MAP).forEach(provider => {
      const keyName = PROVIDER_KEY_MAP[provider];
      const input = document.getElementById(keyName);
      if (input && input.value.trim()) {
        state.apiKeys[keyName] = encryptKey(input.value.trim());
      } else if (input) {
        delete state.apiKeys[keyName];
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
      version: '1.0',
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
    const apiKey = document.getElementById('customModelKey').value.trim();
    const format = document.getElementById('customModelFormat').value;

    if (!name || !endpoint) {
      showToast('请填写模型名称和API端点', 'error');
      return;
    }

    const mention = name.toLowerCase().replace(/\s+/g, '-');
    
    state.customModels.push({
      name,
      mention,
      endpoint,
      apiKey,
      format,
      createdAt: new Date().toISOString()
    });

    saveState();
    renderCustomModels();
    
    document.getElementById('customModelName').value = '';
    document.getElementById('customModelEndpoint').value = '';
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
    // Message input
    const messageInput = document.getElementById('messageInput');
    messageInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
      
      // Mention navigation
      const dropdown = document.getElementById('mentionsDropdown');
      if (!dropdown.classList.contains('hidden')) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          state.mentionIndex = Math.min(state.mentionIndex + 1, dropdown.children.length - 1);
          updateMentionSelection();
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          state.mentionIndex = Math.max(state.mentionIndex - 1, 0);
          updateMentionSelection();
        } else if (e.key === 'Tab' || e.key === 'Enter') {
          e.preventDefault();
          const selected = dropdown.querySelector('.mention-item.selected');
          if (selected) {
            insertMention(selected.dataset.mention);
          }
        } else if (e.key === 'Escape') {
          hideMentions();
        }
      }
    });

    messageInput.addEventListener('input', (e) => {
      const text = e.target.value;
      const atIndex = text.lastIndexOf('@');
      
      if (atIndex !== -1 && atIndex === text.length - 1) {
        showMentions();
      } else if (atIndex !== -1) {
        const filter = text.substring(atIndex + 1);
        if (!filter.includes(' ')) {
          showMentions(filter);
        } else {
          hideMentions();
        }
      } else {
        hideMentions();
      }

      // Auto-resize
      e.target.style.height = 'auto';
      e.target.style.height = Math.min(e.target.scrollHeight, 150) + 'px';
    });

    // Send button
    document.getElementById('sendBtn').addEventListener('click', sendMessage);

    // File input
    document.getElementById('fileInput').addEventListener('change', handleFileSelect);
    document.getElementById('removeFile').addEventListener('click', clearAttachment);

    // URL button
    document.getElementById('urlBtn').addEventListener('click', () => openModal('urlModal'));
    document.getElementById('fetchUrl').addEventListener('click', fetchUrlContent);
    document.getElementById('closeUrlModal').addEventListener('click', () => closeModal('urlModal'));

    // Channel management
    document.getElementById('newChannelBtn').addEventListener('click', createNewChannel);

    // Settings
    document.getElementById('settingsBtn').addEventListener('click', () => {
      loadApiKeysToForm();
      openModal('settingsModal');
    });
    document.getElementById('closeSettings').addEventListener('click', () => closeModal('settingsModal'));
    document.getElementById('saveApiKeys').addEventListener('click', saveApiKeys);

    // Settings tabs
    document.querySelectorAll('.settings-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.settings-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.settings-content').forEach(c => c.classList.add('hidden'));
        tab.classList.add('active');
        document.getElementById(tab.dataset.tab + 'Tab').classList.remove('hidden');
      });
    });

    // GPTs import
    document.getElementById('importGptsBtn').addEventListener('click', importGpts);

    // Content import
    document.getElementById('importContentBtn').addEventListener('click', () => openModal('importContentModal'));
    document.getElementById('closeImportContent').addEventListener('click', () => closeModal('importContentModal'));
    document.getElementById('saveImportContent').addEventListener('click', saveImportContent);

    // Export
    document.getElementById('exportBtn').addEventListener('click', exportToMarkdown);
    document.getElementById('clearChatBtn').addEventListener('click', () => {
      if (!confirm('确定要清空当前频道的对话吗？')) return;
      state.messages[state.currentChannel] = [];
      saveState();
      renderMessages();
      showToast('对话已清空', 'success');
    });

    // Data management
    document.getElementById('exportAllData').addEventListener('click', exportAllData);
    document.getElementById('importDataFile').addEventListener('change', importData);
    document.getElementById('clearAllData').addEventListener('click', clearAllData);

    // Custom models
    document.getElementById('addCustomModel').addEventListener('click', addCustomModel);

    // Close modals on overlay click
    document.querySelectorAll('.fixed.inset-0').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.add('hidden');
        }
      });
    });

    // Click outside mentions dropdown
    document.addEventListener('click', (e) => {
      if (!e.target.closest('#mentionsDropdown') && !e.target.closest('#messageInput')) {
        hideMentions();
      }
    });
  }

  function updateMentionSelection() {
    const dropdown = document.getElementById('mentionsDropdown');
    dropdown.querySelectorAll('.mention-item').forEach((item, idx) => {
      item.classList.toggle('selected', idx === state.mentionIndex);
    });
  }

  // ==================== Initialize ====================
  function init() {
    loadState();
    initEventListeners();
    renderAll();

    // Configure marked
    marked.setOptions({
      highlight: function(code, lang) {
        if (lang && hljs.getLanguage(lang)) {
          return hljs.highlight(code, { language: lang }).value;
        }
        return code;
      },
      breaks: true
    });

    console.log('AI Team Hub initialized');
  }

  // Start
  document.addEventListener('DOMContentLoaded', init);
})();
