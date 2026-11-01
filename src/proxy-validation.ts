// Validate the UI's supported chat payload before provider-specific conversion.
export function validateProxyRequest(body: unknown, provider: string, override?: string):
  {ok: true; model: string} | {ok: false; error: string} {
  const record = (v: any): v is Record<string, any> => v !== null && typeof v === 'object' && !Array.isArray(v)
  const fail = (error: string) => ({ok: false as const, error})
  if (!record(body)) return fail('Request must be an object')
  const model = override || body.model || (provider === 'gemini' ? 'gemini-1.5-pro' : '')
  if (typeof model !== 'string' || !/^[a-zA-Z0-9][a-zA-Z0-9._:/-]{0,199}$/.test(model)) return fail('A valid model is required')
  if (!Array.isArray(body.messages) || !body.messages.length || body.messages.length > 100) return fail('messages must contain 1–100 entries')
  if (body.max_tokens !== undefined && (!Number.isSafeInteger(body.max_tokens) || body.max_tokens < 1 || body.max_tokens > 128000)) return fail('Invalid max_tokens')
  const validImage = (url: unknown) => {
    if (typeof url !== 'string' || url.length > 2 * 1024 * 1024) return false
    if (/^data:image\/(?:png|jpeg|webp|gif);base64,[A-Za-z0-9+/]+={0,2}$/.test(url)) return true
    // The existing Claude/Gemini converters support inline base64 only.
    if (provider === 'claude' || provider === 'gemini') return false
    try { const parsed = new URL(url); return parsed.protocol === 'https:' && !parsed.username && !parsed.password } catch { return false }
  }
  for (const message of body.messages) {
    if (!record(message) || !['system','developer','user','assistant','tool'].includes(message.role)) return fail('Invalid message role')
    if (typeof message.content === 'string') {
      if (message.content.length > 100000) return fail('Message text too long')
    } else if (Array.isArray(message.content) && message.content.length > 0 && message.content.length <= 20) {
      for (const part of message.content) {
        if (!record(part)) return fail('Invalid message content')
        if (part.type === 'text') {
          if (typeof part.text !== 'string' || part.text.length > 100000) return fail('Invalid text content')
        } else if (part.type === 'image_url') {
          if (!record(part.image_url) || !validImage(part.image_url.url)) return fail('Unsupported image URL; use inline base64 for Claude/Gemini')
        } else return fail('Unsupported content type')
      }
    } else return fail('Invalid message content')
  }
  return {ok:true,model}
}
