# AI Team Hub 🤖

**English | [中文](#中文)**

[![Last commit](https://img.shields.io/github/last-commit/shengdabai/AI-Team?style=flat-square)](https://github.com/shengdabai/AI-Team/commits)
[![Stars](https://img.shields.io/github/stars/shengdabai/AI-Team?style=social)](https://github.com/shengdabai/AI-Team/stargazers)
[![Follow @shengdabai](https://img.shields.io/github/followers/shengdabai?style=social)](https://github.com/shengdabai)

> **One chat box. Ten AI providers. `@`-mention any model — or several at once — and watch them debate.**

**AI Team Hub** is a multi-model orchestration playground in a Slack-style interface. Type `@` to summon GPT-4o, Claude, Gemini, Grok, DeepSeek, or a dozen Chinese models, compare their answers side by side, or flip on **Meeting Mode** and let two or more models discuss a topic across several rounds. Your keys, your browser, no backend database — built on the edge with Cloudflare Workers.

🌐 **Live demo:** https://ai-team.pages.dev

---

## Why

Switching tabs between five AI products to compare answers is tedious. Most "multi-model" tools lock you to one vendor's router. AI Team Hub puts every major provider behind one `@`-mention syntax, keeps your API keys in *your* browser (never on a server), and adds a twist no single chat app has: the models can talk to **each other**.

## What

A single-page web app that:
- routes your message to one or many AI providers through a thin Cloudflare proxy (solves CORS, never stores keys),
- normalizes every provider's response into one consistent chat view,
- and, in Meeting Mode, orchestrates a multi-round discussion between the models you mentioned.

## ✨ Features

- **🎯 Multi-model `@`-mentions** — type `@` for a two-level model picker; mention several models in one message to compare answers instantly.
- **🧑‍🤝‍🧑 Meeting Mode** — `@` two or more models and they auto-discuss your topic across configurable rounds, then summarize.
- **📎 File & image analysis** — drop in images, PDFs, text, Markdown, JSON, or CSV as context.
- **🔗 URL analysis** — paste a web link; the app fetches and strips it to clean text as context (with SSRF protection).
- **🔍 Web search** — `@search` via Serper.dev for fresh, grounded answers.
- **🪄 GPTs import** — pull in your OpenAI Assistants and call them by `@`.
- **📚 Content import** — bring in notes from GetNote / NotebookLM as reusable context.
- **💾 Local history + Markdown export** — conversations save to your browser; export any channel to Markdown.
- **⚙️ Custom models** — add any OpenAI-compatible endpoint with your own model ID and key.

## 🤝 Supported Models

Ten providers are wired into the proxy and the model picker — use any `@`-name below:

| Provider | Example `@`-names |
|----------|-------------------|
| **OpenAI** | `@gpt-4o` · `@gpt-4.1` · `@gpt-4o-mini` · `@gpt-4-turbo` |
| **Anthropic Claude** | `@claude-3-5-sonnet-20241022` · `@claude-3-opus-20240229` · `@claude-3-5-haiku-20241022` |
| **Google Gemini** | `@gemini-2.0-flash-exp` · `@gemini-1.5-pro` · `@gemini-1.5-flash` |
| **xAI Grok** | `@grok-2-1212` · `@grok-vision-beta` |
| **DeepSeek** | `@deepseek-chat` (V3) · `@deepseek-reasoner` (R1) · `@deepseek-coder` |
| **OpenRouter** | `@deepseek/deepseek-chat` · `@qwen/qwen-2.5-72b-instruct` (100+ models, one key) |
| **Doubao 豆包** | `@doubao-2.0-pro` · `@doubao-1.5-pro-256k` |
| **Qwen 通义千问** | `@qwen-2.5-max` · `@qwen-coder-plus` |
| **Kimi Moonshot** | `@moonshot-v2-auto` · `@moonshot-v1-128k` |
| **Zhipu GLM 智谱** | `@glm-5-plus` · `@glm-4-flash` |

You can also add **any OpenAI-compatible API** as a custom model from Settings.

## 🧱 Tech Stack

- **Backend / edge proxy:** [Hono](https://hono.dev) on Cloudflare Workers (handles CORS, normalizes provider responses)
- **Frontend:** Vanilla JavaScript + TailwindCSS (CDN), `marked` + `DOMPurify` + `highlight.js`
- **Hosting:** Cloudflare Pages
- **Storage:** browser LocalStorage — keys and history never leave your machine
- **Build:** Vite + Wrangler

## 🚀 Quick Start

```bash
# 1. Clone
git clone https://github.com/shengdabai/AI-Team.git
cd AI-Team

# 2. Install
npm install

# 3. Build + run locally (Cloudflare Pages dev server)
npm run build
npm run preview

# 4. Deploy to your own Cloudflare Pages
npm run deploy
```

No `.env` file is needed for the app itself — API keys are entered in the in-app **Settings ⚙️** panel and stored in your browser. Example placeholders:

```
OpenRouter key:  sk-or-v1-YOUR_KEY_HERE   (recommended — one key for 100+ models)
OpenAI key:      sk-YOUR_KEY_HERE
Serper key:      YOUR_SERPER_KEY_HERE      (for @search)
```

## 📖 Usage

```text
# Single model
@gpt-4o Explain transformers like I'm five.

# Compare models in one shot
@claude-3-5-sonnet-20241022 @gemini-1.5-pro Compare: impact of AI on education.

# Meeting Mode (toggle the 👥 button, then mention 2+ models)
@gpt-4o @deepseek-chat Debate: is remote work better for engineering teams?

# Web search grounded answer
@search latest news on open-weight LLMs
```

Click **📎** to attach a file, **🔗** to analyze a URL, and **export** to save the channel as Markdown.

## 🗺️ Status

Actively developed and live at https://ai-team.pages.dev. Current focus: more providers, richer Meeting Mode orchestration, and streaming responses. Issues and PRs welcome.

## 🤝 Connect / About

Built in public by **Tony (Sheng)** — a Chinese-language teacher (6,000+ students) building AI + Chinese-teaching tools.

If AI Team Hub is useful to you, please **⭐ Star this repo** and **[Follow @shengdabai](https://github.com/shengdabai)** to see what ships next.

More tools in the same ecosystem:
- [everything-claude-code](https://github.com/shengdabai/everything-claude-code)
- [content-creator-hub](https://github.com/shengdabai/content-creator-hub)
- [ai-innovative-app-design](https://github.com/shengdabai/ai-innovative-app-design)

## 📄 License

Released under the MIT License.

---

<a name="中文"></a>

# AI Team Hub 🤖

**[English](#ai-team-hub-) | 中文**

[![Last commit](https://img.shields.io/github/last-commit/shengdabai/AI-Team?style=flat-square)](https://github.com/shengdabai/AI-Team/commits)
[![Stars](https://img.shields.io/github/stars/shengdabai/AI-Team?style=social)](https://github.com/shengdabai/AI-Team/stargazers)
[![Follow @shengdabai](https://img.shields.io/github/followers/shengdabai?style=social)](https://github.com/shengdabai)

> **一个对话框,十家 AI 厂商。`@` 提及任意模型——或一次 @ 多个——看它们互相辩论。**

**AI Team Hub** 是一个类 Slack 界面的多模型编排试验场。输入 `@` 即可召唤 GPT-4o、Claude、Gemini、Grok、DeepSeek 以及一众国产大模型,并排对比它们的回答;或者打开 **会议模式**,让两个以上模型围绕同一话题连续讨论数轮。密钥存在你自己的浏览器里,无后端数据库,基于 Cloudflare Workers 跑在边缘节点。

🌐 **在线体验:** https://ai-team.pages.dev

---

## 为什么做它

为了对比答案在五个 AI 产品之间反复切标签页,太累。大多数所谓"多模型"工具又把你锁死在某一家厂商的路由上。AI Team Hub 把所有主流厂商统一到一套 `@` 提及语法之下,把 API 密钥留在 **你的** 浏览器里(永不上服务器),还加了单一聊天应用都没有的一招:让模型之间 **互相对话**。

## 它是什么

一个单页 Web 应用,它会:
- 通过一层轻量的 Cloudflare 代理,把你的消息分发给一个或多个 AI 厂商(解决 CORS,绝不存储密钥);
- 把每家厂商各异的返回格式统一成一致的聊天视图;
- 在会议模式下,编排你 @ 到的几个模型进行多轮讨论。

## ✨ 核心功能

- **🎯 多模型 `@` 提及** — 输入 `@` 弹出二级模型选择器;一条消息里 @ 多个模型即可瞬间对比答案。
- **🧑‍🤝‍🧑 会议模式** — @ 两个以上模型,它们围绕你的话题自动讨论可配置轮数,最后给出总结。
- **📎 文件 / 图片分析** — 拖入图片、PDF、文本、Markdown、JSON、CSV 作为上下文。
- **🔗 网页链接分析** — 粘贴网址,自动抓取并清洗为纯文本上下文(带 SSRF 防护)。
- **🔍 联网搜索** — 通过 Serper.dev 的 `@search`,获取实时、有据可依的回答。
- **🪄 GPTs 导入** — 拉取你的 OpenAI Assistants,直接 `@` 调用。
- **📚 内容导入** — 把 GetNote / NotebookLM 的笔记作为可复用上下文引入。
- **💾 本地历史 + Markdown 导出** — 对话自动存浏览器;任意频道一键导出 Markdown。
- **⚙️ 自定义模型** — 添加任何 OpenAI 兼容端点,自定义模型 ID 和密钥。

## 🤝 支持的模型

十家厂商已接入代理与模型选择器——下面任意 `@` 名称均可使用:

| 厂商 | 示例 `@` 名称 |
|------|---------------|
| **OpenAI** | `@gpt-4o` · `@gpt-4.1` · `@gpt-4o-mini` · `@gpt-4-turbo` |
| **Anthropic Claude** | `@claude-3-5-sonnet-20241022` · `@claude-3-opus-20240229` · `@claude-3-5-haiku-20241022` |
| **Google Gemini** | `@gemini-2.0-flash-exp` · `@gemini-1.5-pro` · `@gemini-1.5-flash` |
| **xAI Grok** | `@grok-2-1212` · `@grok-vision-beta` |
| **DeepSeek** | `@deepseek-chat` (V3) · `@deepseek-reasoner` (R1) · `@deepseek-coder` |
| **OpenRouter** | `@deepseek/deepseek-chat` · `@qwen/qwen-2.5-72b-instruct`(一个 key,100+ 模型) |
| **豆包 Doubao** | `@doubao-2.0-pro` · `@doubao-1.5-pro-256k` |
| **通义千问 Qwen** | `@qwen-2.5-max` · `@qwen-coder-plus` |
| **Kimi Moonshot** | `@moonshot-v2-auto` · `@moonshot-v1-128k` |
| **智谱 GLM** | `@glm-5-plus` · `@glm-4-flash` |

你也可以在设置里添加 **任何 OpenAI 兼容 API** 作为自定义模型。

## 🧱 技术栈

- **后端 / 边缘代理:** Cloudflare Workers 上的 [Hono](https://hono.dev)(处理 CORS,统一厂商返回)
- **前端:** 原生 JavaScript + TailwindCSS(CDN),`marked` + `DOMPurify` + `highlight.js`
- **托管:** Cloudflare Pages
- **存储:** 浏览器 LocalStorage——密钥与历史永不离开本机
- **构建:** Vite + Wrangler

## 🚀 快速开始

```bash
# 1. 克隆
git clone https://github.com/shengdabai/AI-Team.git
cd AI-Team

# 2. 安装依赖
npm install

# 3. 本地构建 + 运行(Cloudflare Pages 开发服务器)
npm run build
npm run preview

# 4. 部署到你自己的 Cloudflare Pages
npm run deploy
```

应用本身无需 `.env` 文件——API 密钥在应用内 **设置 ⚙️** 面板填写,存于浏览器。占位示例:

```
OpenRouter key:  sk-or-v1-YOUR_KEY_HERE   (推荐——一个 key 通 100+ 模型)
OpenAI key:      sk-YOUR_KEY_HERE
Serper key:      YOUR_SERPER_KEY_HERE      (用于 @search)
```

## 📖 使用示例

```text
# 单模型
@gpt-4o 用五岁小孩能懂的话解释 Transformer。

# 一次对比多个模型
@claude-3-5-sonnet-20241022 @gemini-1.5-pro 对比分析:人工智能对教育的影响。

# 会议模式(点亮 👥 按钮,再 @ 两个以上模型)
@gpt-4o @deepseek-chat 辩论:远程办公对工程团队更好吗?

# 联网搜索 grounding
@search 开源权重大模型的最新动态
```

点 **📎** 附加文件,点 **🔗** 分析网址,点 **导出** 把频道存为 Markdown。

## 🗺️ 项目状态

持续开发中,已上线 https://ai-team.pages.dev。当前重点:接入更多厂商、更丰富的会议模式编排、以及流式响应。欢迎提 Issue 和 PR。

## 🤝 关于 / 联系

由 **Tony(盛)** 公开构建——一位拥有 6000+ 学员的中文老师,正在打造 AI + 中文教学工具。

如果 AI Team Hub 对你有用,欢迎 **⭐ Star 本仓库**,并 **[关注 @shengdabai](https://github.com/shengdabai)**,第一时间看到后续更新。

同一生态下的更多工具:
- [everything-claude-code](https://github.com/shengdabai/everything-claude-code)
- [content-creator-hub](https://github.com/shengdabai/content-creator-hub)
- [ai-innovative-app-design](https://github.com/shengdabai/ai-innovative-app-design)

## 📄 许可证

基于 MIT License 发布。

---

Made with ❤️ by Tony
