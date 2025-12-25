# AI Team Hub - 多模型AI协作平台

一个类似Slack界面的多模型AI协作平台，通过@不同的AI模型组建你的AI团队，协同解决问题。

## ✨ 核心特性

### 🤖 多模型支持
- **OpenAI**: GPT-4.5, GPT-4o, o1, o3-mini 等
- **Anthropic**: Claude Sonnet 4, Claude 3.7/3.5 Sonnet, Opus, Haiku
- **Google**: Gemini 2.5/2.0 Pro, Flash
- **xAI**: Grok 3, Grok 2
- **DeepSeek**: V3, R1, Coder
- **OpenRouter**: 100+ 模型一站式访问 (Llama 4, Mistral, Qwen, Perplexity等)
- **国内模型**: 豆包、通义千问、Kimi、智谱GLM

### 📝 核心功能
- **@多模型对话** - 输入@弹出模型选择器，选择具体型号
- **文件/图片上传** - 支持图片、文本、PDF等格式分析
- **网页链接分析** - 自动提取网页内容供AI分析
- **GPTs导入** - 一键导入OpenAI账户的自定义Assistants
- **内容导入** - 导入Get笔记、NotebookLM等平台内容作为上下文
- **对话历史** - 本地存储，支持Markdown导出
- **自定义模型** - 添加任何OpenAI兼容格式的API

## 🚀 使用方法

### 1. 配置API Key
点击左上角⚙️ → 输入API Key → 保存

**推荐**: 使用 **OpenRouter API Key** 一个Key访问100+模型

### 2. 开始对话
```
@gpt-4o 帮我分析这段代码
@claude-sonnet-4 这个方案有什么问题？
@deepseek-r1 @qwq-32b 对比分析一下
```

### 3. 模型选择
输入 `@` 后会弹出模型选择器：
- 按提供商分组显示
- 显示模型标签 (NEW/HOT/Reasoning等)
- 支持搜索过滤

## 📦 支持的模型列表

### OpenAI
| 模型 | @提及名 | 说明 |
|------|---------|------|
| GPT-4.5 Preview | @gpt-4.5-preview | 最新预览版 |
| GPT-4o | @gpt-4o | 多模态旗舰 |
| GPT-4o Mini | @gpt-4o-mini | 轻量版 |
| o1 | @o1 | 推理模型 |
| o3-mini | @o3-mini | 最新推理 |

### Anthropic
| 模型 | @提及名 | 说明 |
|------|---------|------|
| Claude Sonnet 4 | @claude-sonnet-4-20250514 | 最新版 |
| Claude 3.7 Sonnet | @claude-3-7-sonnet-20250219 | 混合推理 |
| Claude 3.5 Sonnet | @claude-3-5-sonnet-20241022 | 稳定版 |

### OpenRouter (推荐)
| 模型 | @提及名 | 说明 |
|------|---------|------|
| Llama 4 Maverick | @llama-4-maverick | Meta最新 |
| Mistral Large | @mistral-large-2411 | Mistral旗舰 |
| Sonar Pro | @sonar-pro | 联网搜索 |
| QwQ 32B | @qwq-32b | 推理模型 |

## 🛠 技术架构

```
Frontend: TailwindCSS + Vanilla JS + Marked.js
Backend:  Hono Framework
Runtime:  Cloudflare Workers
Storage:  LocalStorage (浏览器端)
```

## 📁 项目结构

```
webapp/
├── src/index.tsx          # Hono后端 + API代理
├── public/static/
│   ├── app.js            # 前端核心逻辑
│   └── styles.css        # Slack风格样式
├── ecosystem.config.cjs  # PM2配置
└── wrangler.jsonc        # Cloudflare配置
```

## 🔧 本地开发

```bash
# 安装依赖
npm install

# 构建
npm run build

# 启动开发服务器
pm2 start ecosystem.config.cjs

# 或直接运行
npm run preview
```

## ☁️ 部署

项目已配置GitHub + Cloudflare Pages自动部署：
- 推送到main分支自动触发部署
- 生产环境: https://jules-test.pages.dev

## 📄 数据存储

所有数据存储在浏览器本地：
- API Keys (Base64编码)
- 对话历史
- 频道配置
- 导入内容

支持JSON格式导出/导入备份。

## 🔐 安全说明

- API Key存储在浏览器LocalStorage
- 所有API调用通过后端代理，避免CORS问题
- Key不会发送到除官方API外的任何地方

---

**作者**: Tony (盛长春)  
**更新**: 2024-12-25
