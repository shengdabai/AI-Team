# AI Team Hub 🤖

[![GPT-4o](https://img.shields.io/badge/GPT-4o-10a37f?style=flat-square&logo=openai&logoColor=white)](https://openai.com)
[![Claude 3.5](https://img.shields.io/badge/Claude-3.5%20Sonnet-d97850?style=flat-square)](https://anthropic.com)
[![Gemini 2.0](https://img.shields.io/badge/Gemini-2.0%20Flash-4285f4?style=flat-square&logo=google&logoColor=white)](https://ai.google)
[![Grok 3](https://img.shields.io/badge/Grok-3-ffffff?style=flat-square&logo=x&logoColor=black)](https://x.ai)
[![DeepSeek V3](https://img.shields.io/badge/DeepSeek-V3-00b4d8?style=flat-square)](https://deepseek.com)

**智能多模型AI协作平台** - 在一个类Slack界面中通过 @ 提及不同AI模型，组建你的AI团队解决复杂问题。

## 🌐 在线访问

**生产环境**: https://ai-team.pages.dev

**GitHub 仓库**: https://github.com/shengdabai/AI-Team

## ✨ 核心功能

### 🎯 多模型对话 (Priority 1)
- 输入 `@` 选择AI模型，支持二级菜单选择具体版本
- 支持同时 @ 多个模型对比回答
- 支持20+主流AI模型

### 📎 文件/图片上传分析 (Priority 1)
- 支持图片、PDF、文本、Markdown、JSON、CSV等格式
- 上传后自动作为上下文发送给AI

### 🔗 网页链接分析 (Priority 1)
- 输入URL自动提取网页内容
- 作为上下文供AI分析

### 🪄 GPTs 导入 (Priority 2)
- 一键导入 OpenAI Assistants
- 导入后可通过 @ 直接调用

### 📚 内容导入 (Priority 2)
- 支持 Get笔记、NotebookLM 内容导入
- 导入后可作为上下文引用

### 💾 对话历史 + 导出 (Priority 3)
- 本地自动保存对话
- 一键导出 Markdown 格式

### ⚙️ 自定义模型 (Priority 4)
- 添加任何 OpenAI 兼容 API
- 自定义端点、模型ID、API Key

## 🤖 支持的AI模型 (使用实际API模型ID)

### OpenAI
| 模型 | @ 名称 | 说明 |
|------|--------|------|
| GPT-4o | `@gpt-4o` | 最新旗舰模型 |
| GPT-4o Mini | `@gpt-4o-mini` | 快速经济版 |
| o1 | `@o1` | 推理模型 |
| o1-mini | `@o1-mini` | 轻量推理 |
| GPT-4 Turbo | `@gpt-4-turbo` | 高性能版 |

### Anthropic Claude
| 模型 | @ 名称 | 说明 |
|------|--------|------|
| Claude Sonnet 4 | `@claude-sonnet-4-20250514` | 最新旗舰 |
| Claude 3.5 Sonnet | `@claude-3-5-sonnet-20241022` | 性能均衡 |
| Claude 3.5 Haiku | `@claude-3-5-haiku-20241022` | 快速响应 |
| Claude 3 Opus | `@claude-3-opus-20240229` | 最强能力 |

### Google Gemini
| 模型 | @ 名称 | 说明 |
|------|--------|------|
| Gemini 2.5 Flash | `@gemini-2.5-flash-preview-05-20` | 最新版本 |
| Gemini 2.0 Flash | `@gemini-2.0-flash` | 主力模型 |
| Gemini 1.5 Pro | `@gemini-1.5-pro` | 长上下文 |
| Gemini 1.5 Flash | `@gemini-1.5-flash` | 快速响应 |

### xAI Grok
| 模型 | @ 名称 | 说明 |
|------|--------|------|
| Grok 3 | `@grok-3` | 最新版本 |
| Grok 3 Fast | `@grok-3-fast` | 快速版 |
| Grok 2 | `@grok-2-1212` | 稳定版 |

### DeepSeek
| 模型 | @ 名称 | 说明 |
|------|--------|------|
| DeepSeek V3 | `@deepseek-chat` | 最新版本 |
| DeepSeek R1 | `@deepseek-reasoner` | 推理模型 |
| DeepSeek Coder | `@deepseek-coder` | 代码专家 |

### OpenRouter (推荐 - 100+模型)
一个API Key访问所有主流模型：
- `@openai/gpt-4o` `@anthropic/claude-sonnet-4` `@google/gemini-2.0-flash-001`
- `@x-ai/grok-3` `@deepseek/deepseek-chat` `@deepseek/deepseek-r1`
- `@meta-llama/llama-3.3-70b-instruct` `@mistralai/mistral-large-2411`

### 中国模型
| 平台 | 模型 | @ 名称 |
|------|------|--------|
| 豆包 | 1.5 Pro 256K | `@doubao-1.5-pro-256k` |
| 通义千问 | Qwen Max | `@qwen-max-latest` |
| Kimi | Moonshot Auto | `@moonshot-v1-auto` |
| 智谱 | GLM-4 Plus | `@glm-4-plus` |

## 🚀 快速开始

### 1. 配置 API Key
1. 打开设置 ⚙️
2. 输入 API Key（推荐使用 OpenRouter，一个Key访问100+模型）
3. 保存

### 2. 开始对话
```
@gpt-4o 你好，介绍一下你自己
```

### 3. 多模型协作
```
@claude-3-5-sonnet-20241022 @gemini-2.0-flash 对比分析：人工智能对教育的影响
```

### 4. 上传文件分析
1. 点击 📎 上传文件
2. 输入问题，选择模型
3. 发送

### 5. 网页链接分析
1. 点击 🔗
2. 输入网页URL
3. 获取内容后提问

## 🛠️ 技术架构

- **前端**: TailwindCSS + Vanilla JS
- **后端**: Hono (Cloudflare Workers)
- **部署**: Cloudflare Pages
- **存储**: LocalStorage (客户端)

## 📁 项目结构

```
AI-Team/
├── src/
│   └── index.tsx         # Hono 后端 + HTML
├── public/
│   └── static/
│       └── app.js        # 前端应用逻辑
├── dist/                  # 构建输出
├── ecosystem.config.cjs   # PM2 配置
├── wrangler.jsonc        # Cloudflare 配置
├── vite.config.ts        # Vite 构建配置
└── package.json
```

## 💻 本地开发

```bash
# 安装依赖
npm install

# 构建
npm run build

# 本地开发
npm run preview

# 部署
npm run deploy
```

## 📝 更新日志

### v3.1 (2025-12-26)
- 🔧 更新所有模型ID为实际API支持的格式
- 🐛 修复 max_tokens 参数问题 (推理模型使用 max_completion_tokens)
- 📊 OpenAI: gpt-4o, o1, o1-mini 等
- 📊 Gemini: gemini-2.0-flash, gemini-1.5-pro 等
- 📊 Claude: claude-3-5-sonnet-20241022, claude-3-opus-20240229 等

### v3.0 (2025-12-26)
- 🎨 全新商务专业界面设计
- 🐛 修复消息发送功能
- 🔧 修复JavaScript CDN库冲突
- 📱 优化响应式布局

### v2.0 (2025-12-26)
- ✨ 添加 OpenRouter 支持 (100+模型)
- 📋 模型选择器升级为二级菜单

### v1.0 (2025-12-26)
- 🚀 初始版本发布
- 💬 Slack风格多模型对话
- 📎 文件/图片上传
- 🔗 网页链接分析
- 💾 对话历史本地保存

## 📄 License

MIT License

---

Made with ❤️ by Tony
