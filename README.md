# AI Team Hub - 多模型AI协作平台

## 项目概述

**AI Team Hub** 是一个类似Slack界面的多模型AI协作平台，让你可以通过@不同的AI模型来组建你的AI团队，协同解决问题。

### 核心特性

- **Slack风格界面** - 熟悉的频道、侧边栏、对话布局
- **多模型@对话** - 支持10+主流AI模型，通过@模型名指定回答
- **文件/图片上传** - 支持上传文件和图片进行分析
- **网页链接分析** - 粘贴URL自动提取内容供AI分析
- **GPTs导入** - 导入OpenAI账户的自定义GPTs
- **内容导入** - 导入Get笔记、NotebookLM等平台内容作为上下文
- **对话历史** - 本地存储对话记录，支持Markdown导出
- **自定义API模型** - 添加任何兼容OpenAI格式的API

## 在线访问

- **预览URL**: https://3000-i2vch200b9kir7yqfcfcd-2b54fc91.sandbox.novita.ai

## 支持的AI模型

| 提供商 | 模型 | @提及名 |
|--------|------|---------|
| OpenAI | GPT-4o | @gpt4o |
| OpenAI | GPT-4 Turbo | @gpt4 |
| OpenAI | GPT-3.5 Turbo | @gpt3.5 |
| OpenAI | o1 | @o1 |
| OpenAI | o1-mini | @o1-mini |
| Anthropic | Claude 3.5 Sonnet | @claude |
| Anthropic | Claude 3 Opus | @claude-opus |
| Anthropic | Claude 3.5 Haiku | @claude-haiku |
| Google | Gemini 1.5 Pro | @gemini |
| Google | Gemini 1.5 Flash | @gemini-flash |
| xAI | Grok | @grok |
| DeepSeek | DeepSeek Chat | @deepseek |
| DeepSeek | DeepSeek Coder | @deepseek-coder |
| 字节跳动 | 豆包 | @doubao |
| 阿里云 | 通义千问 | @qwen |
| 阿里云 | 千问Turbo | @qwen-turbo |
| 月之暗面 | Kimi | @kimi |
| 智谱AI | GLM-4 | @glm |
| 智谱AI | GLM-4 Flash | @glm-flash |

## 使用指南

### 1. 配置API Keys

1. 点击左上角的⚙️设置按钮
2. 在"API Keys"标签页中输入你的各平台API Key
3. 点击"保存 API Keys"

### 2. 开始对话

在消息框中输入消息，使用`@模型名`来指定AI回答：

```
@gpt4o 帮我分析一下这段代码的性能问题
```

可以同时@多个模型获取不同观点：

```
@claude @gemini 对于微服务架构和单体架构，你们怎么看？
```

### 3. 上传文件

- 点击📎按钮上传文件或图片
- 支持格式：图片(jpg/png/gif)、文本(txt/md)、JSON、CSV、PDF

### 4. 分析网页

- 点击🔗按钮输入网页URL
- 系统会自动提取网页内容供AI分析

### 5. 导入GPTs

- 配置OpenAI API Key后
- 点击侧边栏"我的GPTs"旁的下载按钮
- 自动导入你在OpenAI创建的所有Assistants

### 6. 导入外部内容

- 点击侧边栏"导入内容"旁的+按钮
- 选择来源(Get笔记/NotebookLM/其他)
- 粘贴导出的内容
- 在对话中使用@内容名引用

### 7. 导出对话

- 点击右上角导出按钮，将当前频道对话导出为Markdown
- 在设置-数据管理中可导出/导入所有数据

## 技术架构

```
├── 前端
│   ├── TailwindCSS - 样式框架
│   ├── Vanilla JavaScript - 无框架依赖
│   ├── Marked.js - Markdown渲染
│   ├── DOMPurify - XSS防护
│   └── Highlight.js - 代码高亮
│
├── 后端 (Hono Framework)
│   ├── API代理 - 处理CORS限制
│   ├── URL抓取 - 提取网页内容
│   └── GPTs列表 - 获取用户Assistants
│
└── 部署
    └── Cloudflare Pages
```

## 数据存储

所有数据存储在浏览器本地：

- **API Keys** - Base64编码存储在localStorage
- **对话历史** - localStorage
- **频道配置** - localStorage
- **导入内容** - localStorage

支持导出为JSON备份，导入恢复数据。

## 项目结构

```
webapp/
├── src/
│   └── index.tsx          # Hono后端入口
├── public/
│   └── static/
│       ├── app.js         # 前端JavaScript
│       └── styles.css     # 自定义样式
├── ecosystem.config.cjs   # PM2配置
├── wrangler.jsonc         # Cloudflare配置
├── vite.config.ts         # Vite构建配置
└── package.json
```

## 本地开发

```bash
# 安装依赖
npm install

# 构建项目
npm run build

# 启动开发服务器
npm run preview
# 或使用PM2
pm2 start ecosystem.config.cjs
```

## 部署到Cloudflare

```bash
# 构建并部署
npm run deploy
```

## 未来规划

- [ ] 支持图片直接发送给视觉模型
- [ ] 对话流式输出
- [ ] 更多AI模型支持
- [ ] 团队协作功能
- [ ] 插件系统

## 技术栈

- **Framework**: Hono v4
- **Runtime**: Cloudflare Workers
- **Build**: Vite
- **Styling**: TailwindCSS (CDN)
- **Storage**: LocalStorage (Browser)

---

**最后更新**: 2024-12-25

**作者**: Tony (盛长春)
