import { WorkerEntrypoint } from 'cloudflare:workers'

// Separate Worker entrypoint for a Pages RPC service binding. Provision this
// service and its native PROXY_REQUESTS binding before enabling the Pages proxy.
export default class ProxyLimiter extends WorkerEntrypoint<{ PROXY_REQUESTS: RateLimit }> {
  async limit(input: { key: string }): Promise<{ success: boolean }> {
    if (!input || typeof input.key !== 'string' || !input.key.startsWith('proxy:') ||
        input.key.length <= 6 || input.key.length > 262) {
      return { success: false }
    }
    // An absent or failed native binding rejects the RPC; the Pages gate then
    // returns 503. Never fall back to per-process counters or an unlimited mode.
    return this.env.PROXY_REQUESTS.limit({ key: input.key })
  }

  async fetch(): Promise<Response> {
    return new Response('Not found', { status: 404 })
  }
}
