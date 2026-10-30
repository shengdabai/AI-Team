import type { MiddlewareHandler } from 'hono'
import { verifyWithJwks } from 'hono/jwt'

export type ProxyBindings = {
  ENABLE_PUBLIC_UPSTREAM_PROXY?: string
  ACCESS_TEAM_DOMAIN?: string
  ACCESS_AUD?: string
  PROXY_RATE_LIMITER?: { limit(input: { key: string }): Promise<{ success: boolean }> }
  FETCH_ALLOWED_HOSTS?: string
}

// The provider API key is not an application identity. Validate Access's signed
// assertion before parsing a request or contacting a paid upstream provider.
export const requireProxyAccess: MiddlewareHandler<{ Bindings: ProxyBindings }> = async (c, next) => {
  c.header('Cache-Control', 'no-store')
  if (c.env.ENABLE_PUBLIC_UPSTREAM_PROXY !== 'true') {
    return c.json({ error: 'Public upstream proxy is disabled' }, 404)
  }
  const { ACCESS_TEAM_DOMAIN: issuer, ACCESS_AUD: audience, PROXY_RATE_LIMITER: limiter } = c.env
  if (!issuer || !/^https:\/\/[a-z0-9-]+\.cloudflareaccess\.com$/.test(issuer) ||
      !audience || !limiter || typeof limiter.limit !== 'function') {
    return c.json({ error: 'Proxy access controls are not configured' }, 503)
  }
  const token = c.req.header('Cf-Access-Jwt-Assertion')
  if (!token || token.length > 16384) return c.json({ error: 'Authentication required' }, 401)

  let subject: string
  try {
    const payload = await verifyWithJwks(token, {
      jwks_uri: `${issuer}/cdn-cgi/access/certs`,
      allowedAlgorithms: ['RS256'],
      verification: { iss: issuer, aud: audience },
    // Workers reject redirect:'error'; 'manual' returns the 3xx as a non-ok response, which fails verification.
    }, { redirect: 'manual', signal: AbortSignal.timeout(5000) })
    // Hono checks time claims when present. This gate requires them as well.
    if (typeof payload.exp !== 'number' || typeof payload.iat !== 'number' ||
        typeof payload.sub !== 'string' || !payload.sub || payload.sub.length > 256) throw new Error()
    subject = payload.sub
  } catch {
    return c.json({ error: 'Invalid or expired identity' }, 401)
  }
  try {
    // All outbound routes share one counter per authenticated subject. Never key
    // this on a caller-supplied IP header, provider key, or unverified JWT claim.
    const { success } = await limiter.limit({ key: `proxy:${subject}` })
    if (!success) return c.json({ error: 'Too many requests' }, 429)
  } catch {
    return c.json({ error: 'Proxy rate limiter unavailable' }, 503)
  }
  await next()
}

export function allowedFetchUrl(value: unknown, allowedHosts?: string): URL | null {
  if (typeof value !== 'string' || value.length > 4096 || !allowedHosts) return null
  try {
    const url = new URL(value)
    if (url.protocol !== 'https:' || url.username || url.password || url.port ||
        !/^[a-z0-9][a-z0-9.-]*\.[a-z]{2,}$/.test(url.hostname) ||
        /(?:^|\.)(?:localhost|local|internal|test|invalid)$/.test(url.hostname)) return null
    const hosts = allowedHosts.split(',').map(host => host.trim().toLowerCase())
    return hosts.includes(url.hostname) ? url : null
  } catch { return null }
}

// Bound response allocation even when Content-Length is absent or dishonest.
export async function readLimitedText(response: Response, maxBytes = 1024 * 1024): Promise<string> {
  if (!response.body) return ''
  const reader = response.body.getReader()
  const chunks: Uint8Array[] = []
  let total = 0
  try {
    while (true) {
      const { value, done } = await reader.read()
      if (done) break
      total += value.byteLength
      if (total > maxBytes) throw new Error('Response too large')
      chunks.push(value)
    }
  } finally {
    await reader.cancel()
    reader.releaseLock()
  }
  const bytes = new Uint8Array(total)
  let offset = 0
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length }
  return new TextDecoder().decode(bytes)
}
