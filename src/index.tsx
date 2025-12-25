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
        'HTTP-Referer': 'https://ai-team-hub.pages.dev',
        'X-Title': 'AI Team Hub'
      }
    }
  }

  const config = providerConfigs[provider]
  if (!config) {
    return c.json({ error: 'Unknown provider' }, 400)
  }

  try {
    // Transform request body for different providers
    let requestBody = body
    requestBody.model = model
    
    if (provider === 'claude') {
      // Claude API format
      requestBody = {
        model: model || 'claude-3-5-sonnet-20241022',
        max_tokens: body.max_tokens || 4096,
        messages: body.messages
      }
    } else if (provider === 'gemini') {
      // Gemini API format
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
    
    // Normalize response format
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
    
    // Extract text content (simple extraction)
    const textContent = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 10000) // Limit content length
    
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
    // Fetch user's GPTs from OpenAI
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

// Main HTML page
app.get('/', (c) => {
  return c.html(`<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Team Hub - 多模型AI协作平台</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/dompurify@3.0.6/dist/purify.min.js"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/highlight.js@11.9.0/styles/github-dark.min.css">
    <script src="https://cdn.jsdelivr.net/npm/highlight.js@11.9.0/lib/core.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/highlight.js@11.9.0/lib/languages/javascript.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/highlight.js@11.9.0/lib/languages/python.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/highlight.js@11.9.0/lib/languages/typescript.min.js"></script>
    <link href="/static/styles.css" rel="stylesheet">
</head>
<body class="bg-slack-dark text-white h-screen overflow-hidden">
    <div id="app" class="flex h-full">
        <!-- Sidebar -->
        <aside id="sidebar" class="w-72 bg-slack-sidebar flex flex-col border-r border-slack-border">
            <!-- Workspace Header -->
            <div class="p-4 border-b border-slack-border">
                <div class="flex items-center justify-between">
                    <h1 class="text-lg font-bold flex items-center gap-2">
                        <i class="fas fa-robot text-slack-accent"></i>
                        AI Team Hub
                    </h1>
                    <button id="settingsBtn" class="text-gray-400 hover:text-white p-1">
                        <i class="fas fa-cog"></i>
                    </button>
                </div>
            </div>
            
            <!-- Channels -->
            <div class="flex-1 overflow-y-auto p-3">
                <div class="mb-4">
                    <div class="flex items-center justify-between text-gray-400 text-sm mb-2">
                        <span><i class="fas fa-hashtag mr-1"></i> 对话频道</span>
                        <button id="newChannelBtn" class="hover:text-white">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                    <div id="channelList" class="space-y-1">
                        <!-- Channels will be rendered here -->
                    </div>
                </div>
                
                <!-- AI Models by Provider -->
                <div class="mb-4">
                    <div class="text-gray-400 text-sm mb-2">
                        <i class="fas fa-brain mr-1"></i> AI 模型
                    </div>
                    <div id="modelList" class="space-y-1 text-sm">
                        <!-- Models will be rendered here -->
                    </div>
                </div>
                
                <!-- Imported GPTs -->
                <div class="mb-4">
                    <div class="flex items-center justify-between text-gray-400 text-sm mb-2">
                        <span><i class="fas fa-magic mr-1"></i> 我的 GPTs</span>
                        <button id="importGptsBtn" class="hover:text-white">
                            <i class="fas fa-download"></i>
                        </button>
                    </div>
                    <div id="gptsList" class="space-y-1 text-sm">
                        <!-- GPTs will be rendered here -->
                    </div>
                </div>
                
                <!-- Imported Content -->
                <div>
                    <div class="flex items-center justify-between text-gray-400 text-sm mb-2">
                        <span><i class="fas fa-file-import mr-1"></i> 导入内容</span>
                        <button id="importContentBtn" class="hover:text-white">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                    <div id="importedContent" class="space-y-1 text-sm">
                        <!-- Imported content will be rendered here -->
                    </div>
                </div>
            </div>
            
            <!-- User Info -->
            <div class="p-3 border-t border-slack-border">
                <div class="flex items-center gap-2">
                    <div class="w-8 h-8 rounded bg-slack-accent flex items-center justify-center">
                        <i class="fas fa-user text-sm"></i>
                    </div>
                    <div class="flex-1">
                        <div class="text-sm font-medium">Tony</div>
                        <div class="text-xs text-gray-400">在线</div>
                    </div>
                </div>
            </div>
        </aside>
        
        <!-- Main Content -->
        <main class="flex-1 flex flex-col bg-slack-dark">
            <!-- Channel Header -->
            <header class="h-14 border-b border-slack-border flex items-center justify-between px-4">
                <div class="flex items-center gap-2">
                    <i class="fas fa-hashtag text-gray-400"></i>
                    <span id="currentChannelName" class="font-semibold">general</span>
                    <span id="currentChannelDesc" class="text-gray-400 text-sm ml-2"></span>
                </div>
                <div class="flex items-center gap-3">
                    <button id="exportBtn" class="text-gray-400 hover:text-white" title="导出为Markdown">
                        <i class="fas fa-file-export"></i>
                    </button>
                    <button id="clearChatBtn" class="text-gray-400 hover:text-white" title="清空对话">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </header>
            
            <!-- Messages Area -->
            <div id="messagesArea" class="flex-1 overflow-y-auto p-4 space-y-4">
                <!-- Messages will be rendered here -->
                <div class="text-center text-gray-500 py-8">
                    <i class="fas fa-comments text-4xl mb-4"></i>
                    <p>开始与AI团队对话</p>
                    <p class="text-sm mt-2">使用 @模型名 来指定AI回答，例如: @gpt-4o 你好</p>
                </div>
            </div>
            
            <!-- Input Area -->
            <div class="p-4 border-t border-slack-border">
                <!-- File Preview -->
                <div id="filePreview" class="hidden mb-3 p-3 bg-slack-hover rounded-lg">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <i id="fileIcon" class="fas fa-file text-slack-accent"></i>
                            <span id="fileName" class="text-sm"></span>
                        </div>
                        <button id="removeFile" class="text-gray-400 hover:text-red-400">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div id="imagePreviewContainer" class="mt-2 hidden">
                        <img id="imagePreview" class="max-h-32 rounded" />
                    </div>
                </div>
                
                <!-- Mentions Dropdown with Sub-menu -->
                <div id="mentionsDropdown" class="hidden absolute bottom-24 left-80 bg-slack-sidebar border border-slack-border rounded-lg shadow-xl max-h-96 overflow-y-auto w-80 z-50">
                    <!-- Mentions will be rendered here -->
                </div>
                
                <div class="flex items-end gap-3">
                    <!-- File Upload -->
                    <div class="flex gap-2">
                        <label class="cursor-pointer text-gray-400 hover:text-white p-2">
                            <i class="fas fa-paperclip"></i>
                            <input type="file" id="fileInput" class="hidden" accept="image/*,.pdf,.txt,.md,.json,.csv" />
                        </label>
                        <button id="urlBtn" class="text-gray-400 hover:text-white p-2" title="添加网页链接">
                            <i class="fas fa-link"></i>
                        </button>
                    </div>
                    
                    <!-- Message Input -->
                    <div class="flex-1 relative">
                        <textarea 
                            id="messageInput" 
                            class="w-full bg-slack-input border border-slack-border rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-slack-accent resize-none"
                            placeholder="输入消息，使用 @ 来选择AI模型..."
                            rows="1"
                        ></textarea>
                    </div>
                    
                    <!-- Send Button -->
                    <button id="sendBtn" class="bg-slack-accent hover:bg-slack-accent-hover text-white px-4 py-3 rounded-lg transition-colors">
                        <i class="fas fa-paper-plane"></i>
                    </button>
                </div>
                
                <div class="text-xs text-gray-500 mt-2">
                    输入 @ 选择模型 | 支持 OpenAI / Claude / Gemini / Grok / DeepSeek / OpenRouter 等
                </div>
            </div>
        </main>
    </div>
    
    <!-- Settings Modal -->
    <div id="settingsModal" class="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-slack-sidebar rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div class="p-4 border-b border-slack-border flex justify-between items-center">
                <h2 class="text-lg font-bold"><i class="fas fa-cog mr-2"></i>设置</h2>
                <button id="closeSettings" class="text-gray-400 hover:text-white">
                    <i class="fas fa-times text-xl"></i>
                </button>
            </div>
            <div class="p-4">
                <div id="settingsTabs" class="flex gap-2 mb-4 border-b border-slack-border flex-wrap">
                    <button class="settings-tab active px-4 py-2 text-sm" data-tab="apikeys">API Keys</button>
                    <button class="settings-tab px-4 py-2 text-sm" data-tab="custom">自定义模型</button>
                    <button class="settings-tab px-4 py-2 text-sm" data-tab="data">数据管理</button>
                </div>
                
                <!-- API Keys Tab -->
                <div id="apikeysTab" class="settings-content">
                    <div class="space-y-4">
                        <!-- OpenRouter - 推荐 -->
                        <div class="api-key-item p-3 bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-lg border border-purple-500/30">
                            <label class="block text-sm font-medium mb-1">
                                <i class="fas fa-route text-purple-400 mr-1"></i> OpenRouter API Key
                                <span class="ml-2 text-xs bg-purple-500 text-white px-2 py-0.5 rounded">推荐 - 100+模型</span>
                            </label>
                            <input type="password" id="openrouterKey" class="w-full bg-slack-input border border-slack-border rounded px-3 py-2 text-sm" placeholder="sk-or-..." />
                            <p class="text-xs text-gray-400 mt-1">一个Key访问所有主流模型: GPT-4.5, Claude, Gemini, Llama, Mistral等</p>
                        </div>
                        
                        <div class="border-t border-slack-border pt-4 mt-4">
                            <p class="text-xs text-gray-500 mb-3">或使用各平台官方API Key:</p>
                        </div>
                        
                        <div class="api-key-item">
                            <label class="block text-sm font-medium mb-1">
                                <i class="fas fa-robot text-green-500 mr-1"></i> OpenAI API Key
                            </label>
                            <input type="password" id="openaiKey" class="w-full bg-slack-input border border-slack-border rounded px-3 py-2 text-sm" placeholder="sk-..." />
                            <p class="text-xs text-gray-500 mt-1">GPT-4o, GPT-4.5, o1, o3 及 GPTs</p>
                        </div>
                        
                        <div class="api-key-item">
                            <label class="block text-sm font-medium mb-1">
                                <i class="fas fa-cloud text-orange-500 mr-1"></i> Anthropic API Key
                            </label>
                            <input type="password" id="claudeKey" class="w-full bg-slack-input border border-slack-border rounded px-3 py-2 text-sm" placeholder="sk-ant-..." />
                            <p class="text-xs text-gray-500 mt-1">Claude 3.5/4 Sonnet, Opus, Haiku</p>
                        </div>
                        
                        <div class="api-key-item">
                            <label class="block text-sm font-medium mb-1">
                                <i class="fas fa-gem text-blue-500 mr-1"></i> Google AI API Key
                            </label>
                            <input type="password" id="geminiKey" class="w-full bg-slack-input border border-slack-border rounded px-3 py-2 text-sm" placeholder="AIza..." />
                            <p class="text-xs text-gray-500 mt-1">Gemini 2.0/2.5 Pro, Flash</p>
                        </div>
                        
                        <div class="api-key-item">
                            <label class="block text-sm font-medium mb-1">
                                <i class="fab fa-x-twitter text-white mr-1"></i> xAI API Key
                            </label>
                            <input type="password" id="grokKey" class="w-full bg-slack-input border border-slack-border rounded px-3 py-2 text-sm" placeholder="xai-..." />
                            <p class="text-xs text-gray-500 mt-1">Grok 2, Grok 3</p>
                        </div>
                        
                        <div class="api-key-item">
                            <label class="block text-sm font-medium mb-1">
                                <i class="fas fa-fish text-cyan-500 mr-1"></i> DeepSeek API Key
                            </label>
                            <input type="password" id="deepseekKey" class="w-full bg-slack-input border border-slack-border rounded px-3 py-2 text-sm" placeholder="sk-..." />
                            <p class="text-xs text-gray-500 mt-1">DeepSeek V3, R1, Coder</p>
                        </div>
                        
                        <div class="api-key-item">
                            <label class="block text-sm font-medium mb-1">
                                <i class="fas fa-fire text-red-500 mr-1"></i> 豆包 API Key
                            </label>
                            <input type="password" id="doubaoKey" class="w-full bg-slack-input border border-slack-border rounded px-3 py-2 text-sm" placeholder="..." />
                        </div>
                        
                        <div class="api-key-item">
                            <label class="block text-sm font-medium mb-1">
                                <i class="fas fa-cloud-sun text-purple-500 mr-1"></i> 通义千问 API Key
                            </label>
                            <input type="password" id="qwenKey" class="w-full bg-slack-input border border-slack-border rounded px-3 py-2 text-sm" placeholder="sk-..." />
                        </div>
                        
                        <div class="api-key-item">
                            <label class="block text-sm font-medium mb-1">
                                <i class="fas fa-moon text-yellow-500 mr-1"></i> Kimi API Key
                            </label>
                            <input type="password" id="kimiKey" class="w-full bg-slack-input border border-slack-border rounded px-3 py-2 text-sm" placeholder="..." />
                        </div>
                        
                        <div class="api-key-item">
                            <label class="block text-sm font-medium mb-1">
                                <i class="fas fa-brain text-indigo-500 mr-1"></i> 智谱 GLM API Key
                            </label>
                            <input type="password" id="glmKey" class="w-full bg-slack-input border border-slack-border rounded px-3 py-2 text-sm" placeholder="..." />
                        </div>
                        
                        <button id="saveApiKeys" class="w-full bg-slack-accent hover:bg-slack-accent-hover text-white py-2 rounded mt-4">
                            <i class="fas fa-save mr-2"></i>保存 API Keys
                        </button>
                    </div>
                </div>
                
                <!-- Custom Models Tab -->
                <div id="customTab" class="settings-content hidden">
                    <div class="mb-4">
                        <h3 class="text-sm font-medium mb-2">添加自定义API模型</h3>
                        <div class="space-y-3">
                            <input type="text" id="customModelName" class="w-full bg-slack-input border border-slack-border rounded px-3 py-2 text-sm" placeholder="模型名称 (用于@提及)" />
                            <input type="text" id="customModelEndpoint" class="w-full bg-slack-input border border-slack-border rounded px-3 py-2 text-sm" placeholder="API Endpoint URL" />
                            <input type="text" id="customModelId" class="w-full bg-slack-input border border-slack-border rounded px-3 py-2 text-sm" placeholder="模型ID (如 gpt-4)" />
                            <input type="password" id="customModelKey" class="w-full bg-slack-input border border-slack-border rounded px-3 py-2 text-sm" placeholder="API Key" />
                            <button id="addCustomModel" class="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded">
                                <i class="fas fa-plus mr-2"></i>添加模型
                            </button>
                        </div>
                    </div>
                    <div id="customModelsList" class="space-y-2">
                        <!-- Custom models will be listed here -->
                    </div>
                </div>
                
                <!-- Data Management Tab -->
                <div id="dataTab" class="settings-content hidden">
                    <div class="space-y-4">
                        <div>
                            <h3 class="text-sm font-medium mb-2">导出数据</h3>
                            <button id="exportAllData" class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded">
                                <i class="fas fa-download mr-2"></i>导出所有数据 (JSON)
                            </button>
                        </div>
                        <div>
                            <h3 class="text-sm font-medium mb-2">导入数据</h3>
                            <label class="block w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded text-center cursor-pointer">
                                <i class="fas fa-upload mr-2"></i>导入数据 (JSON)
                                <input type="file" id="importDataFile" class="hidden" accept=".json" />
                            </label>
                        </div>
                        <div>
                            <h3 class="text-sm font-medium mb-2">清除数据</h3>
                            <button id="clearAllData" class="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded">
                                <i class="fas fa-trash mr-2"></i>清除所有本地数据
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <!-- Import Content Modal -->
    <div id="importContentModal" class="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-slack-sidebar rounded-lg w-full max-w-lg">
            <div class="p-4 border-b border-slack-border flex justify-between items-center">
                <h2 class="text-lg font-bold"><i class="fas fa-file-import mr-2"></i>导入内容</h2>
                <button id="closeImportContent" class="text-gray-400 hover:text-white">
                    <i class="fas fa-times text-xl"></i>
                </button>
            </div>
            <div class="p-4 space-y-4">
                <div>
                    <label class="block text-sm font-medium mb-1">内容名称</label>
                    <input type="text" id="importContentName" class="w-full bg-slack-input border border-slack-border rounded px-3 py-2" placeholder="例如: Get笔记-项目规划" />
                </div>
                <div>
                    <label class="block text-sm font-medium mb-1">来源</label>
                    <select id="importContentSource" class="w-full bg-slack-input border border-slack-border rounded px-3 py-2">
                        <option value="getnote">Get笔记</option>
                        <option value="notebooklm">NotebookLM</option>
                        <option value="other">其他</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium mb-1">内容 (粘贴导出的文本)</label>
                    <textarea id="importContentText" class="w-full bg-slack-input border border-slack-border rounded px-3 py-2 h-48" placeholder="在此粘贴从Get笔记或NotebookLM导出的内容..."></textarea>
                </div>
                <button id="saveImportContent" class="w-full bg-slack-accent hover:bg-slack-accent-hover text-white py-2 rounded">
                    <i class="fas fa-save mr-2"></i>保存内容
                </button>
            </div>
        </div>
    </div>
    
    <!-- URL Input Modal -->
    <div id="urlModal" class="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-slack-sidebar rounded-lg w-full max-w-lg">
            <div class="p-4 border-b border-slack-border flex justify-between items-center">
                <h2 class="text-lg font-bold"><i class="fas fa-link mr-2"></i>添加网页链接</h2>
                <button id="closeUrlModal" class="text-gray-400 hover:text-white">
                    <i class="fas fa-times text-xl"></i>
                </button>
            </div>
            <div class="p-4 space-y-4">
                <div>
                    <label class="block text-sm font-medium mb-1">网页 URL</label>
                    <input type="url" id="urlInput" class="w-full bg-slack-input border border-slack-border rounded px-3 py-2" placeholder="https://..." />
                </div>
                <button id="fetchUrl" class="w-full bg-slack-accent hover:bg-slack-accent-hover text-white py-2 rounded">
                    <i class="fas fa-download mr-2"></i>获取内容
                </button>
            </div>
        </div>
    </div>
    
    <script src="/static/app.js"></script>
</body>
</html>`)
})

export default app
