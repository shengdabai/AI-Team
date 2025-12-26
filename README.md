# AI Team Hub 🤖

[![GPT-5.2](https://img.shields.io/badge/GPT-5.2-10a37f?style=flat-square&logo=openai&logoColor=white)](https://openai.com)
[![Claude 4.5](https://img.shields.io/badge/Claude-4.5-d97850?style=flat-square)](https://anthropic.com)
[![Gemini 3](https://img.shields.io/badge/Gemini-3%20Pro-4285f4?style=flat-square&logo=google&logoColor=white)](https://ai.google)
[![Grok 4.1](https://img.shields.io/badge/Grok-4.1-ffffff?style=flat-square&logo=x&logoColor=black)](https://x.ai)
[![DeepSeek V3.2](https://img.shields.io/badge/DeepSeek-V3.2-00b4d8?style=flat-square)](https://deepseek.com)

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

## 🤖 支持的AI模型

### OpenAI
| 模型 | @ 名称 | 说明 |
|------|--------|------|
| GPT-5.2 | `@gpt-5.2` | 最新旗舰模型 |
| GPT-5.1 | `@gpt-5.1` | |
| GPT-5 | `@gpt-5` | |
| GPT-4.5 Preview | `@gpt-4.5-preview` | |
| GPT-4o | `@gpt-4o` | 多模态模型 |
| o3 | `@o3` | 推理模型 |

### Anthropic Claude
| 模型 | @ 名称 | 说明 |
|------|--------|------|
| Claude Opus 4.5 | `@claude-opus-4.5` | 最新旗舰 |
| Claude Sonnet 4.5 | `@claude-sonnet-4.5` | |
| Claude Haiku 4.5 | `@claude-haiku-4.5` | 快速响应 |

### Google Gemini
| 模型 | @ 名称 | 说明 |
|------|--------|------|
| Gemini 3 Pro | `@gemini-3-pro` | 最新旗舰 |
| Gemini 3 Pro Vision | `@gemini-3-pro-vision` | 视觉能力 |
| Gemini 3 Flash | `@gemini-3-flash` | 快速响应 |

### xAI Grok
| 模型 | @ 名称 | 说明 |
|------|--------|------|
| Grok 4.1 | `@grok-4.1` | 最新版本 |
| Grok 4 | `@grok-4` | |
| Grok 3 | `@grok-3` | |

### DeepSeek
| 模型 | @ 名称 | 说明 |
|------|--------|------|
| DeepSeek V3.2 | `@deepseek-v3.2` | 最新版本 |
| DeepSeek R1 | `@deepseek-r1` | 推理模型 |
| DeepSeek Coder | `@deepseek-coder` | 代码专家 |

### OpenRouter (推荐 - 100+模型)
一个API Key访问所有主流模型：
- `@gpt-5.2` `@claude-opus-4.5` `@gemini-3-pro` `@grok-4.1`
- `@llama-4-maverick` `@mistral-large` `@qwen-2.5-72b` `@sonar-pro`

### 中国模型
| 平台 | 模型 | @ 名称 |
|------|------|--------|
| 豆包 | Pro 256K | `@doubao-pro-256k` |
| 通义千问 | Qwen Max | `@qwen-max-latest` |
| Kimi | Moonshot Auto | `@moonshot-v1-auto` |
| 智谱 | GLM-4.7 | `@glm-4.7` |

## 🚀 快速开始

### 1. 配置 API Key
1. 打开设置 ⚙️
2. 输入 API Key（推荐使用 OpenRouter，一个Key访问100+模型）
3. 保存

### 2. 开始对话
```
@gpt-5.2 你好，介绍一下你自己
```

### 3. 多模型协作
```
@claude-opus-4.5 @gemini-3-pro 对比分析：人工智能对教育的影响
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

### v3.0 (2025-12-26)
- 🎨 全新商务专业界面设计
- 🐛 修复消息发送功能
- 🔧 修复JavaScript CDN库冲突
- 📱 优化响应式布局

### v2.0 (2025-12-26)
- ✨ 添加 OpenRouter 支持 (100+模型)
- 📋 模型选择器升级为二级菜单
- 🔄 更新至最新模型 (GPT-5.2, Claude 4.5, Gemini 3, Grok 4.1)

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
