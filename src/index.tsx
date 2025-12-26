import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-pages'

const app = new Hono()

// Enable CORS for API routes
app.use('/api/*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'X-API-Key', 'X-Provider', 'X-Model'],
}))

// Serve static files
app.use('/static/*', serveStatic())

// API Proxy for AI providers (handles CORS issues)
app.post('/api/proxy/:provider', async (c) => {
  const provider = c.req.param('provider')
  const body = await c.req.json()
  const apiKey = c.req.header('X-API-Key')
  const modelOverride = c.req.header('X-Model')
  
  if (!apiKey) {
    return c.json({ error: 'API Key required' }, 401)
  }

  const model = modelOverride || body.model

  const providerConfigs: Record<string, { url: string; headers: Record<string, string> }> = {
    openai: {
      url: 'https://api.openai.com/v1/chat/completions',
      headers: { 'Authorization': `Bearer ${apiKey}` }
    },
    claude: {
      url: 'https://api.anthropic.com/v1/messages',
      headers: { 
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      }
    },
    gemini: {
      url: `https://generativelanguage.googleapis.com/v1beta/models/${model || 'gemini-1.5-pro'}:generateContent?key=${apiKey}`,
      headers: {}
    },
    deepseek: {
      url: 'https://api.deepseek.com/v1/chat/completions',
      headers: { 'Authorization': `Bearer ${apiKey}` }
    },
    doubao: {
      url: 'https://ark.cn-beijing.volces.com/api/v3/chat/completions',
      headers: { 'Authorization': `Bearer ${apiKey}` }
    },
    qwen: {
      url: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
      headers: { 'Authorization': `Bearer ${apiKey}` }
    },
    kimi: {
      url: 'https://api.moonshot.cn/v1/chat/completions',
      headers: { 'Authorization': `Bearer ${apiKey}` }
    },
    glm: {
      url: 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
      headers: { 'Authorization': `Bearer ${apiKey}` }
    },
    grok: {
      url: 'https://api.x.ai/v1/chat/completions',
      headers: { 'Authorization': `Bearer ${apiKey}` }
    },
    openrouter: {
      url: 'https://openrouter.ai/api/v1/chat/completions',
      headers: { 
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://ai-team.pages.dev',
        'X-Title': 'AI Team Hub'
      }
    }
  }

  const config = providerConfigs[provider]
  if (!config) {
    return c.json({ error: 'Unknown provider' }, 400)
  }

  try {
    let requestBody = body
    requestBody.model = model
    
    if (provider === 'claude') {
      requestBody = {
        model: model || 'claude-3-5-sonnet-20241022',
        max_tokens: body.max_tokens || 4096,
        messages: body.messages
      }
    } else if (provider === 'gemini') {
      requestBody = {
        contents: body.messages.map((m: any) => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }]
        })),
        generationConfig: {
          maxOutputTokens: body.max_tokens || 4096
        }
      }
    }

    const response = await fetch(config.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...config.headers
      },
      body: JSON.stringify(requestBody)
    })

    const data = await response.json()
    
    let normalizedResponse = data
    
    if (provider === 'claude' && data.content) {
      normalizedResponse = {
        choices: [{
          message: {
            role: 'assistant',
            content: data.content[0]?.text || ''
          }
        }]
      }
    } else if (provider === 'gemini' && data.candidates) {
      normalizedResponse = {
        choices: [{
          message: {
            role: 'assistant',
            content: data.candidates[0]?.content?.parts?.[0]?.text || ''
          }
        }]
      }
    }

    return c.json(normalizedResponse)
  } catch (error: any) {
    return c.json({ error: error.message }, 500)
  }
})

// Fetch URL content for analysis
app.post('/api/fetch-url', async (c) => {
  const { url } = await c.req.json()
  
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; AITeamBot/1.0)'
      }
    })
    const html = await response.text()
    
    const textContent = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 10000)
    
    return c.json({ content: textContent, url })
  } catch (error: any) {
    return c.json({ error: error.message }, 500)
  }
})

// OpenAI GPTs list endpoint
app.post('/api/gpts/list', async (c) => {
  const apiKey = c.req.header('X-API-Key')
  
  if (!apiKey) {
    return c.json({ error: 'API Key required' }, 401)
  }

  try {
    const response = await fetch('https://api.openai.com/v1/assistants?limit=100', {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'OpenAI-Beta': 'assistants=v2'
      }
    })
    
    const data = await response.json()
    return c.json(data)
  } catch (error: any) {
    return c.json({ error: error.message }, 500)
  }
})

// Main HTML page - Professional Business Design
app.get('/', (c) => {
  return c.html(`<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Team Hub - 智能协作平台</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.1/css/all.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css" rel="stylesheet">
    <script>
      tailwind.config = {
        theme: {
          extend: {
            colors: {
              brand: { 50: '#eff6ff', 100: '#dbeafe', 200: '#bfdbfe', 300: '#93c5fd', 400: '#60a5fa', 500: '#3b82f6', 600: '#2563eb', 700: '#1d4ed8', 800: '#1e40af', 900: '#1e3a8a' },
              slate: { 750: '#293548', 850: '#172033' }
            }
          }
        }
      }
    </script>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
      
      * { box-sizing: border-box; }
      body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: linear-gradient(180deg, #0f172a 0%, #1e293b 100%); }
      
      ::-webkit-scrollbar { width: 8px; height: 8px; }
      ::-webkit-scrollbar-track { background: rgba(30, 41, 59, 0.5); }
      ::-webkit-scrollbar-thumb { background: #475569; border-radius: 4px; }
      ::-webkit-scrollbar-thumb:hover { background: #64748b; }
      
      @keyframes fadeSlideIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
      @keyframes slideRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
      
      .animate-fadeIn { animation: fadeSlideIn 0.4s ease-out; }
      .animate-slideRight { animation: slideRight 0.3s ease-out; }
      
      .typing-dot { width: 8px; height: 8px; border-radius: 50%; background: #64748b; animation: pulse 1.2s infinite; }
      .typing-dot:nth-child(2) { animation-delay: 0.2s; }
      .typing-dot:nth-child(3) { animation-delay: 0.4s; }
      
      .msg-content pre { background: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 16px; overflow-x: auto; margin: 16px 0; }
      .msg-content code { font-family: 'JetBrains Mono', 'Fira Code', monospace; font-size: 13px; }
      .msg-content code:not(pre code) { background: #334155; padding: 2px 8px; border-radius: 4px; color: #f1f5f9; }
      .msg-content p { margin-bottom: 14px; line-height: 1.75; color: #e2e8f0; }
      .msg-content ul, .msg-content ol { margin-left: 24px; margin-bottom: 14px; color: #e2e8f0; }
      .msg-content li { margin-bottom: 6px; }
      .msg-content h1, .msg-content h2, .msg-content h3 { color: #f8fafc; margin: 20px 0 12px; font-weight: 600; }
      .msg-content blockquote { border-left: 4px solid #3b82f6; padding-left: 16px; margin: 16px 0; color: #94a3b8; font-style: italic; }
      .msg-content a { color: #60a5fa; text-decoration: underline; }
      .msg-content table { border-collapse: collapse; width: 100%; margin: 16px 0; }
      .msg-content th, .msg-content td { border: 1px solid #334155; padding: 10px 14px; text-align: left; }
      .msg-content th { background: #1e293b; color: #f1f5f9; font-weight: 600; }
      
      .glass-panel { background: rgba(15, 23, 42, 0.85); backdrop-filter: blur(16px); border: 1px solid rgba(71, 85, 105, 0.4); }
      .glass-light { background: rgba(30, 41, 59, 0.7); backdrop-filter: blur(12px); border: 1px solid rgba(71, 85, 105, 0.3); }
      
      .btn-primary { background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); box-shadow: 0 4px 14px rgba(59, 130, 246, 0.35); }
      .btn-primary:hover { background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%); transform: translateY(-1px); box-shadow: 0 6px 20px rgba(59, 130, 246, 0.45); }
      
      .input-field { background: rgba(30, 41, 59, 0.6); border: 1px solid rgba(71, 85, 105, 0.5); transition: all 0.2s; }
      .input-field:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15); outline: none; }
      
      .channel-item { padding: 10px 14px; border-radius: 8px; cursor: pointer; transition: all 0.15s; }
      .channel-item:hover { background: rgba(59, 130, 246, 0.1); }
      .channel-item.active { background: rgba(59, 130, 246, 0.2); border-left: 3px solid #3b82f6; }
      
      .provider-badge { font-size: 10px; padding: 3px 8px; border-radius: 6px; font-weight: 600; letter-spacing: 0.3px; }
      
      .toast { position: fixed; bottom: 24px; right: 24px; padding: 14px 24px; border-radius: 12px; color: white; font-weight: 500; z-index: 9999; animation: slideRight 0.3s ease-out; box-shadow: 0 10px 40px rgba(0,0,0,0.3); }
      .toast.success { background: linear-gradient(135deg, #10b981, #059669); }
      .toast.error { background: linear-gradient(135deg, #ef4444, #dc2626); }
      .toast.info { background: linear-gradient(135deg, #3b82f6, #2563eb); }
      
      .status-indicator { width: 8px; height: 8px; border-radius: 50%; }
      .status-indicator.online { background: #22c55e; box-shadow: 0 0 8px rgba(34, 197, 94, 0.6); }
      .status-indicator.offline { background: #64748b; }
      
      .settings-tab { color: #94a3b8; }
      .settings-tab:hover { color: #e2e8f0; background: rgba(59, 130, 246, 0.1); }
      .settings-tab.active { color: #3b82f6; background: rgba(59, 130, 246, 0.15); border-bottom: 2px solid #3b82f6; }
    </style>
</head>
<body class="text-slate-200 min-h-screen">
    <div id="app" class="flex h-screen overflow-hidden">
        <!-- Sidebar -->
        <aside class="w-[280px] bg-slate-900/80 backdrop-blur-xl border-r border-slate-700/50 flex flex-col shrink-0">
            <!-- Logo -->
            <div class="p-5 border-b border-slate-700/50">
                <div class="flex items-center gap-3">
                    <div class="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
                        <i class="fas fa-brain text-white text-lg"></i>
                    </div>
                    <div>
                        <h1 class="font-bold text-lg text-white">AI Team Hub</h1>
                        <p class="text-xs text-slate-400">智能协作平台 v3.0</p>
                    </div>
                </div>
            </div>
            
            <!-- Navigation -->
            <nav class="flex-1 overflow-y-auto p-4 space-y-6">
                <!-- Channels -->
                <section>
                    <div class="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3 px-2">
                        <span><i class="fas fa-comments mr-2"></i>对话频道</span>
                        <button id="newChannelBtn" class="hover:text-blue-400 transition-colors p-1">
                            <i class="fas fa-plus text-xs"></i>
                        </button>
                    </div>
                    <div id="channelList" class="space-y-1"></div>
                </section>
                
                <!-- AI Models -->
                <section>
                    <div class="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3 px-2">
                        <i class="fas fa-microchip mr-2"></i>AI 模型库
                    </div>
                    <div id="modelList" class="space-y-1"></div>
                </section>
                
                <!-- GPTs -->
                <section>
                    <div class="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3 px-2">
                        <span><i class="fas fa-wand-magic-sparkles mr-2"></i>我的 GPTs</span>
                        <button id="importGptsBtn" class="hover:text-blue-400 transition-colors p-1">
                            <i class="fas fa-cloud-arrow-down text-xs"></i>
                        </button>
                    </div>
                    <div id="gptsList" class="space-y-1 px-2"></div>
                </section>
                
                <!-- Imported Content -->
                <section>
                    <div class="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3 px-2">
                        <span><i class="fas fa-file-import mr-2"></i>导入内容</span>
                        <button id="importContentBtn" class="hover:text-blue-400 transition-colors p-1">
                            <i class="fas fa-plus text-xs"></i>
                        </button>
                    </div>
                    <div id="importedContent" class="space-y-1 px-2"></div>
                </section>
            </nav>
            
            <!-- User -->
            <div class="p-4 border-t border-slate-700/50">
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center font-bold text-white shadow-lg">T</div>
                        <div>
                            <div class="text-sm font-semibold text-white">Tony</div>
                            <div class="text-xs text-slate-400 flex items-center gap-1.5">
                                <span class="status-indicator online"></span>在线
                            </div>
                        </div>
                    </div>
                    <button id="settingsBtn" class="w-10 h-10 rounded-lg hover:bg-slate-700/50 flex items-center justify-center text-slate-400 hover:text-white transition-all">
                        <i class="fas fa-cog"></i>
                    </button>
                </div>
            </div>
        </aside>
        
        <!-- Main Content -->
        <main class="flex-1 flex flex-col min-w-0">
            <!-- Header -->
            <header class="h-16 border-b border-slate-700/50 flex items-center justify-between px-6 bg-slate-900/50 backdrop-blur-xl shrink-0">
                <div class="flex items-center gap-3">
                    <div class="w-9 h-9 rounded-lg bg-blue-500/20 flex items-center justify-center">
                        <i class="fas fa-hashtag text-blue-400"></i>
                    </div>
                    <div>
                        <h2 id="currentChannelName" class="font-semibold text-white">general</h2>
                        <p id="currentChannelDesc" class="text-xs text-slate-400">AI团队协作频道</p>
                    </div>
                </div>
                <div class="flex items-center gap-2">
                    <button id="exportBtn" class="h-9 px-4 rounded-lg hover:bg-slate-700/50 flex items-center gap-2 text-slate-400 hover:text-white transition-all text-sm">
                        <i class="fas fa-file-export"></i>
                        <span class="hidden sm:inline">导出MD</span>
                    </button>
                    <button id="clearChatBtn" class="h-9 px-4 rounded-lg hover:bg-red-500/20 flex items-center gap-2 text-slate-400 hover:text-red-400 transition-all text-sm">
                        <i class="fas fa-trash"></i>
                        <span class="hidden sm:inline">清空</span>
                    </button>
                </div>
            </header>
            
            <!-- Messages Area -->
            <div id="messagesArea" class="flex-1 overflow-y-auto p-6">
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
            </div>
            
            <!-- Input Area -->
            <div class="p-4 border-t border-slate-700/50 bg-slate-900/50 backdrop-blur-xl shrink-0">
                <!-- File Preview -->
                <div id="filePreview" class="hidden mb-3 p-3 rounded-xl glass-light">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                                <i id="fileIcon" class="fas fa-file text-blue-400"></i>
                            </div>
                            <span id="fileName" class="text-sm font-medium text-white"></span>
                        </div>
                        <button id="removeFile" class="w-8 h-8 rounded-lg hover:bg-red-500/20 flex items-center justify-center text-slate-400 hover:text-red-400 transition-all">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div id="imagePreviewContainer" class="mt-3 hidden">
                        <img id="imagePreview" class="max-h-40 rounded-lg border border-slate-700/50" />
                    </div>
                </div>
                
                <!-- Mentions Dropdown -->
                <div id="mentionsDropdown" class="hidden absolute bottom-36 left-[300px] glass-panel rounded-xl shadow-2xl max-h-[400px] overflow-y-auto w-[360px] z-50"></div>
                
                <!-- Input -->
                <div class="flex items-end gap-3">
                    <div class="flex gap-1">
                        <label class="w-11 h-11 rounded-xl hover:bg-slate-700/50 flex items-center justify-center text-slate-400 hover:text-blue-400 cursor-pointer transition-all">
                            <i class="fas fa-paperclip text-lg"></i>
                            <input type="file" id="fileInput" class="hidden" accept="image/*,.pdf,.txt,.md,.json,.csv" />
                        </label>
                        <button id="urlBtn" class="w-11 h-11 rounded-xl hover:bg-slate-700/50 flex items-center justify-center text-slate-400 hover:text-blue-400 transition-all">
                            <i class="fas fa-link text-lg"></i>
                        </button>
                    </div>
                    
                    <div class="flex-1 relative">
                        <textarea 
                            id="messageInput" 
                            class="w-full input-field rounded-xl px-4 py-3 text-white placeholder-slate-500 resize-none text-[15px]"
                            placeholder="输入消息，使用 @ 选择AI模型..."
                            rows="1"
                        ></textarea>
                    </div>
                    
                    <button id="sendBtn" class="h-11 px-6 rounded-xl btn-primary text-white font-semibold transition-all flex items-center gap-2">
                        <i class="fas fa-paper-plane"></i>
                        <span class="hidden sm:inline">发送</span>
                    </button>
                </div>
                
                <div class="text-xs text-slate-500 mt-3 flex items-center gap-5 px-1">
                    <span><kbd class="bg-slate-700 px-1.5 py-0.5 rounded text-slate-300">Enter</kbd> 发送</span>
                    <span><kbd class="bg-slate-700 px-1.5 py-0.5 rounded text-slate-300">@</kbd> 选择模型</span>
                    <span><i class="fas fa-paperclip mr-1"></i>支持文件/图片</span>
                </div>
            </div>
        </main>
    </div>
    
    <!-- Settings Modal -->
    <div id="settingsModal" class="hidden fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div class="glass-panel rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden shadow-2xl">
            <div class="p-5 border-b border-slate-700/50 flex justify-between items-center">
                <h2 class="text-lg font-bold text-white flex items-center gap-2">
                    <i class="fas fa-cog text-blue-400"></i>设置中心
                </h2>
                <button id="closeSettings" class="w-9 h-9 rounded-lg hover:bg-slate-700/50 flex items-center justify-center text-slate-400 hover:text-white transition-all">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="p-5 overflow-y-auto max-h-[calc(85vh-80px)]">
                <div class="flex gap-1 mb-6 border-b border-slate-700/50 pb-4">
                    <button class="settings-tab active px-4 py-2.5 text-sm rounded-lg font-medium transition-all" data-tab="apikeys">API Keys</button>
                    <button class="settings-tab px-4 py-2.5 text-sm rounded-lg font-medium transition-all" data-tab="custom">自定义模型</button>
                    <button class="settings-tab px-4 py-2.5 text-sm rounded-lg font-medium transition-all" data-tab="data">数据管理</button>
                </div>
                
                <!-- API Keys Tab -->
                <div id="apikeysTab" class="settings-content space-y-5">
                    <div class="p-5 rounded-xl bg-gradient-to-r from-purple-500/15 to-blue-500/15 border border-purple-500/30">
                        <label class="block text-sm font-semibold mb-2 text-white">
                            <i class="fas fa-route text-purple-400 mr-2"></i>OpenRouter API Key
                            <span class="ml-2 text-[10px] bg-gradient-to-r from-purple-500 to-blue-500 text-white px-2.5 py-1 rounded-full font-bold">推荐 · 100+模型</span>
                        </label>
                        <input type="password" id="openrouterKey" class="w-full input-field rounded-lg px-4 py-3 text-sm" placeholder="sk-or-v1-..." />
                        <p class="text-xs text-slate-400 mt-2">一个API Key访问OpenAI、Claude、Gemini等100+模型</p>
                    </div>
                    
                    <div class="border-t border-slate-700/50 pt-5">
                        <p class="text-xs text-slate-500 mb-4 font-medium">或配置各平台官方API Key:</p>
                    </div>
                    
                    <div class="grid gap-4">
                        <div>
                            <label class="block text-sm font-medium mb-2"><i class="fas fa-robot text-green-400 mr-2"></i>OpenAI</label>
                            <input type="password" id="openaiKey" class="w-full input-field rounded-lg px-4 py-2.5 text-sm" placeholder="sk-..." />
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-2"><i class="fas fa-cloud text-orange-400 mr-2"></i>Anthropic Claude</label>
                            <input type="password" id="claudeKey" class="w-full input-field rounded-lg px-4 py-2.5 text-sm" placeholder="sk-ant-..." />
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-2"><i class="fas fa-gem text-blue-400 mr-2"></i>Google Gemini</label>
                            <input type="password" id="geminiKey" class="w-full input-field rounded-lg px-4 py-2.5 text-sm" placeholder="AIza..." />
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-2"><i class="fab fa-x-twitter mr-2"></i>xAI Grok</label>
                            <input type="password" id="grokKey" class="w-full input-field rounded-lg px-4 py-2.5 text-sm" placeholder="xai-..." />
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-2"><i class="fas fa-fish text-cyan-400 mr-2"></i>DeepSeek</label>
                            <input type="password" id="deepseekKey" class="w-full input-field rounded-lg px-4 py-2.5 text-sm" placeholder="sk-..." />
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-2"><i class="fas fa-fire text-red-400 mr-2"></i>豆包</label>
                            <input type="password" id="doubaoKey" class="w-full input-field rounded-lg px-4 py-2.5 text-sm" placeholder="..." />
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-2"><i class="fas fa-cloud-sun text-purple-400 mr-2"></i>通义千问</label>
                            <input type="password" id="qwenKey" class="w-full input-field rounded-lg px-4 py-2.5 text-sm" placeholder="sk-..." />
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-2"><i class="fas fa-moon text-yellow-400 mr-2"></i>Kimi Moonshot</label>
                            <input type="password" id="kimiKey" class="w-full input-field rounded-lg px-4 py-2.5 text-sm" placeholder="..." />
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-2"><i class="fas fa-brain text-indigo-400 mr-2"></i>智谱 GLM</label>
                            <input type="password" id="glmKey" class="w-full input-field rounded-lg px-4 py-2.5 text-sm" placeholder="..." />
                        </div>
                    </div>
                    
                    <button id="saveApiKeys" class="w-full h-12 rounded-xl btn-primary text-white font-semibold mt-2">
                        <i class="fas fa-save mr-2"></i>保存所有 API Keys
                    </button>
                </div>
                
                <!-- Custom Models Tab -->
                <div id="customTab" class="settings-content hidden space-y-4">
                    <div class="p-4 rounded-xl glass-light space-y-3">
                        <input type="text" id="customModelName" class="w-full input-field rounded-lg px-4 py-2.5 text-sm" placeholder="模型名称 (用于@提及)" />
                        <input type="text" id="customModelEndpoint" class="w-full input-field rounded-lg px-4 py-2.5 text-sm" placeholder="API Endpoint URL" />
                        <input type="text" id="customModelId" class="w-full input-field rounded-lg px-4 py-2.5 text-sm" placeholder="模型ID (可选)" />
                        <input type="password" id="customModelKey" class="w-full input-field rounded-lg px-4 py-2.5 text-sm" placeholder="API Key" />
                        <button id="addCustomModel" class="w-full h-11 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-semibold transition-all">
                            <i class="fas fa-plus mr-2"></i>添加自定义模型
                        </button>
                    </div>
                    <div id="customModelsList" class="space-y-2"></div>
                </div>
                
                <!-- Data Tab -->
                <div id="dataTab" class="settings-content hidden space-y-4">
                    <button id="exportAllData" class="w-full h-12 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-semibold transition-all">
                        <i class="fas fa-download mr-2"></i>导出所有数据 (JSON)
                    </button>
                    <label class="block w-full h-12 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-semibold transition-all cursor-pointer">
                        <span class="flex items-center justify-center h-full"><i class="fas fa-upload mr-2"></i>导入数据 (JSON)</span>
                        <input type="file" id="importDataFile" class="hidden" accept=".json" />
                    </label>
                    <button id="clearAllData" class="w-full h-12 rounded-xl bg-red-500 hover:bg-red-400 text-white font-semibold transition-all">
                        <i class="fas fa-trash mr-2"></i>清除所有本地数据
                    </button>
                </div>
            </div>
        </div>
    </div>
    
    <!-- Import Content Modal -->
    <div id="importContentModal" class="hidden fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div class="glass-panel rounded-2xl w-full max-w-lg shadow-2xl">
            <div class="p-5 border-b border-slate-700/50 flex justify-between items-center">
                <h2 class="text-lg font-bold text-white"><i class="fas fa-file-import text-blue-400 mr-2"></i>导入内容</h2>
                <button id="closeImportContent" class="w-9 h-9 rounded-lg hover:bg-slate-700/50 flex items-center justify-center text-slate-400 hover:text-white transition-all">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="p-5 space-y-4">
                <div>
                    <label class="block text-sm font-medium mb-2">内容名称</label>
                    <input type="text" id="importContentName" class="w-full input-field rounded-lg px-4 py-2.5" placeholder="例如: Get笔记-项目规划" />
                </div>
                <div>
                    <label class="block text-sm font-medium mb-2">来源</label>
                    <select id="importContentSource" class="w-full input-field rounded-lg px-4 py-2.5">
                        <option value="getnote">Get笔记</option>
                        <option value="notebooklm">NotebookLM</option>
                        <option value="other">其他</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium mb-2">内容</label>
                    <textarea id="importContentText" class="w-full input-field rounded-lg px-4 py-2.5 h-40" placeholder="粘贴导出的文本内容..."></textarea>
                </div>
                <button id="saveImportContent" class="w-full h-12 rounded-xl btn-primary text-white font-semibold">
                    <i class="fas fa-save mr-2"></i>保存内容
                </button>
            </div>
        </div>
    </div>
    
    <!-- URL Modal -->
    <div id="urlModal" class="hidden fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div class="glass-panel rounded-2xl w-full max-w-lg shadow-2xl">
            <div class="p-5 border-b border-slate-700/50 flex justify-between items-center">
                <h2 class="text-lg font-bold text-white"><i class="fas fa-link text-blue-400 mr-2"></i>分析网页链接</h2>
                <button id="closeUrlModal" class="w-9 h-9 rounded-lg hover:bg-slate-700/50 flex items-center justify-center text-slate-400 hover:text-white transition-all">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="p-5 space-y-4">
                <div>
                    <label class="block text-sm font-medium mb-2">网页 URL</label>
                    <input type="url" id="urlInput" class="w-full input-field rounded-lg px-4 py-2.5" placeholder="https://..." />
                </div>
                <button id="fetchUrl" class="w-full h-12 rounded-xl btn-primary text-white font-semibold">
                    <i class="fas fa-download mr-2"></i>获取网页内容
                </button>
            </div>
        </div>
    </div>
    
    <!-- Scripts -->
    <script src="https://cdn.jsdelivr.net/npm/marked@12.0.0/marked.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/dompurify@3.0.8/dist/purify.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
    <script src="/static/app.js"></script>
</body>
</html>`)
})

export default app
