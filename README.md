# AI-Team

Multi-model AI orchestration playground: @-mention GPT-4o, Claude, Gemini, Grok, DeepSeek and 5 Chinese models, compare or let them debate.

## Business Context

- **Category:** AI workflow infrastructure
- **Audience:** AI builders, creators, independent developers, and small teams that want repeatable local AI workflows.
- **Repository status:** Public repository. Keep examples, docs, and issues free of credentials, private data, and machine-specific paths.
- **Topics:** ai, chatbot, cloudflare-workers, deepseek, gemini, hono, llm, multi-model, openrouter, orchestration

## What This Project Is For

- Multi-model AI orchestration playground: @-mention GPT-4o, Claude, Gemini, Grok, DeepSeek and 5 Chinese models, compare or let them debate.
- Package repeatable AI workflows into reusable local assets.
- Reduce one-off prompt work with versioned skills, guardrails, and handoff files.

## Where It Fits

This repository is part of a broader AI local-workbench operating model: reusable skills, local automation, auditable configuration, and repeatable delivery workflows.

## Technical Overview

- **Primary language:** JavaScript
- **Detected stack:** JavaScript, Node.js, Vite
- **Default branch:** `main`
- **Visibility:** `PUBLIC`
- **License:** MIT License

## Repository Map

- `src`
- `public`
- `LICENSE`
- `README.md`
- `SECURITY.md`
- `ecosystem.config.cjs`
- `package-lock.json`
- `package.json`
- `tsconfig.json`
- `vite.config.ts`
- `wrangler.jsonc`

## 🤝 Supported Models

Ten providers are wired into the proxy and the model picker — use any `@`-name below:

| Provider | Example `@`-names |
|----------|-------------------|
| **OpenAI** | `@gpt-4o` · `@gpt-4.1` · `@gpt-4o-mini` |
| **Anthropic Claude** | `@claude-3-5-sonnet-20241022` · `@claude-3-opus-20240229` · `@claude-3-5-haiku-20241022` |
| **Google Gemini** | `@gemini-2.0-flash` · `@gemini-1.5-pro` · `@gemini-1.5-flash` |
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
- **Storage:** browser LocalStorage for history; API keys stay in page memory only and must be re-entered after the page is closed
- **Build:** Vite + Wrangler

Outbound APIs remain disabled by default. Enabling requires verified Cloudflare Access JWTs and a
`PROXY_RATE_LIMITER` binding exposing `limit({ key })`; missing controls fail closed. Pages requires
an RPC service adapter rather than a native `ratelimits` declaration with the locked Wrangler version.
URL fetching requires exact trusted domains in `FETCH_ALLOWED_HOSTS`, rejects redirects, and caps
HTML/text responses at 1 MiB. See the Chinese security section below for configuration and test limits.

## 🚀 Quick Start

```bash
npm ci
npm run dev
npm run preview

# Deploy to your own Cloudflare Pages
npm run deploy
```

No `.env` file is needed for the app itself — API keys are entered in the in-app **Settings ⚙️** panel and kept in page memory only. Example placeholders:

```
OpenRouter key:  sk-or-v1-YOUR_KEY_HERE   (recommended — one key for 100+ models)
OpenAI key:      sk-YOUR_KEY_HERE
Serper key:      YOUR_SERPER_KEY_HERE      (for @search)
```

| Command | Purpose |
|---|---|
| `npm ci` | Install the locked dependencies. |
| `npm test` | Security and chat-behaviour tests (Node.js 24). |
| `npm run dev` | vite |
| `npm run preview` | wrangler pages dev |
| `npm run build` | vite build |

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
- **📎 文件 / 图片分析** — 支持 PNG/JPEG/WebP/GIF 图片（最多 1.5 MiB）与文本、Markdown、JSON、CSV（最多 100000 字节）作为上下文；暂不支持 PDF。
- **🔗 网页链接分析** — 粘贴网址,自动抓取并清洗为纯文本上下文(带 SSRF 防护)。
- **🔍 联网搜索** — 通过 Serper.dev 的 `@search`,获取实时、有据可依的回答。
- **🪄 GPTs 导入** — 目前仅导入 OpenAI Assistants 列表，尚未实现 Assistants 对话；提及时会保留输入并提示选择普通模型。
- **📚 内容导入** — 把 GetNote / NotebookLM 的笔记作为可复用上下文引入。
- **💾 本地历史 + Markdown 导出** — 对话自动存浏览器;任意频道一键导出 Markdown。
- **⚙️ 自定义模型** — 添加任何 OpenAI 兼容端点,自定义模型 ID 和密钥。

## 🤝 支持的模型

十家厂商已接入代理与模型选择器——下面任意 `@` 名称均可使用:

| 厂商 | 示例 `@` 名称 |
|------|---------------|
| **OpenAI** | `@gpt-4o` · `@gpt-4.1` · `@gpt-4o-mini` |
| **Anthropic Claude** | `@claude-3-5-sonnet-20241022` · `@claude-3-opus-20240229` · `@claude-3-5-haiku-20241022` |
| **Google Gemini** | `@gemini-2.0-flash` · `@gemini-1.5-pro` · `@gemini-1.5-flash` |
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
- **存储:** 浏览器 LocalStorage 保存历史;API Key 只保留在页面内存,关闭页面后需重新输入
- **构建:** Vite + Wrangler

### 代理安全与本地验证

代理默认关闭，填写模型 API Key 不会启用代理。启用前需要配置 `ACCESS_TEAM_DOMAIN`
（`https://<team>.cloudflareaccess.com`）、`ACCESS_AUD`，以及具有 `limit({ key })`
方法、返回 `{ success: boolean }` 的 `PROXY_RATE_LIMITER` 绑定。每个请求验证 Access
的 RS256 签名、issuer、audience、过期时间、签发时间和 subject，再按已验证身份限流。
配置缺失、身份无效或限流故障均拒绝转发；Access 策略决定哪些用户可以访问此应用。
页面与 `/api/*` 必须位于同一个受 Access 保护的应用内，由 Access 注入签名请求头。

当前 Pages 配置未提供上述绑定，不能据本地测试认定线上可用。锁文件中的 Wrangler
不支持在 Pages 配置中直接声明 `ratelimits`；Pages 需通过支持 `limit` 方法的 RPC
服务绑定接入限流器，或另行规划 Workers 部署。`src/limiter-worker.ts` 提供独立 Worker
入口；它需要原生 `PROXY_REQUESTS` 限流绑定，Pages 的 `PROXY_RATE_LIMITER` 服务绑定
指向这个 Worker。仓库没有新增部署配置，未创建或启用任何服务。绑定、Access 策略和阈值需要在
目标环境验收。Cloudflare 原生限流按区域近似计数，不能用作严格的全球费用上限。

网页抓取还要求 `FETCH_ALLOWED_HOSTS`（逗号分隔的精确域名，无通配符）。只配置运营方
信任且控制 DNS 的公开域名；此名单不代替 DNS 层的出站控制。抓取仅允许 HTTPS、禁止
重定向与 URL 凭据，仅接受 HTML/纯文本，响应最多 1 MiB。所有上游请求均设置超时并
拒绝重定向。API Key 只保留在页面内存，关闭页面后需重新输入。

使用 Node.js 24 运行 `npm test`。测试在内存中打包真实路由，使用本地生成的临时签名密钥、
模拟限流器和模拟 fetch；不读取账号凭据、不联系真实模型服务。构建使用 `npm run build`。
此测试不替代 Access 登录、真实绑定、浏览器交互及真实上游的验收。

参考：[Access JWT 校验](https://developers.cloudflare.com/cloudflare-one/access-controls/applications/http-apps/authorization-cookie/validating-json/)、
[Workers 限流绑定及准确性](https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/)。

## 🚀 快速开始

```bash
# 1. 克隆
git clone https://github.com/shengdabai/AI-Team.git
cd AI-Team

# 2. 安装依赖
npm ci

# 3. 本地构建 + 运行(Cloudflare Pages 开发服务器)
npm run build
npm run preview

# 4. 部署到你自己的 Cloudflare Pages
npm run deploy
```

---

## Operating Notes

- Keep real credentials out of the repository. Use local environment files, GitHub repository secrets, or the deployment platform secret manager.
- If a `.env.example` file exists, treat it as documentation only; never commit filled-in `.env` files.
- Before publishing screenshots, demos, or client examples, remove private names, internal paths, account IDs, and API endpoints.
- The `Repository Hygiene` workflow is a lightweight guardrail, not a replacement for product-specific tests.

## Delivery Checklist

- [ ] README describes the user, business outcome, and operating boundary.
- [ ] Setup or preview commands are current and do not rely on private machine state.
- [ ] No real secrets, private user data, or machine-local state are tracked.
- [ ] Screenshots, demos, or sample outputs are safe to share publicly when the repository is public.
- [ ] Product-specific tests or smoke checks are documented before production use.

## Roadmap

- Tighten the fastest path from clone to useful demo.
- Add project-specific screenshots, sample outputs, or a short walkthrough where useful.
- Promote repeated manual steps into scripts, tests, or documented workflows.
- Keep security, privacy, and licensing boundaries explicit as the project evolves.

## Maintainer Notes

Maintained by [Tony Sheng](https://github.com/shengdabai). This README is written as a business-facing handoff: it should help a future collaborator, client, or reviewer understand why the repository exists, how to inspect it, and what must be true before it is reused or shipped.
