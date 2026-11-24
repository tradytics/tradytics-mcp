#!/usr/bin/env node
import { createInterface } from 'node:readline'

const VERSION = '0.1.1'
const DEFAULT_URL = 'https://tradytics.com/mcp'

function parseArgs(argv) {
  let apiKey = process.env.TRADYTICS_API_KEY || ''
  let url = process.env.TRADYTICS_MCP_URL || DEFAULT_URL
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a === '-v' || a === '--version') {
      process.stdout.write(`tradytics-mcp ${VERSION}\n`)
      process.exit(0)
    }
    if (a === '-h' || a === '--help') {
      process.stdout.write(
        `tradytics-mcp ${VERSION}\n` +
        'Stdio MCP bridge for Tradytics (https://tradytics.com/mcp).\n\n' +
        'Usage:\n' +
        '  TRADYTICS_API_KEY=tdy_... npx -y tradytics-mcp\n' +
        '  tradytics-mcp --api-key tdy_... [--url https://tradytics.com/mcp]\n\n' +
        'Get a free API key at https://tradytics.com/developer/keys\n'
      )
      process.exit(0)
    }
    if (a === '--api-key' && argv[i + 1]) apiKey = argv[++i]
    else if (a.startsWith('--api-key=')) apiKey = a.slice('--api-key='.length)
    else if (a === '--url' && argv[i + 1]) url = argv[++i]
    else if (a.startsWith('--url=')) url = a.slice('--url='.length)
  }
  return { apiKey: apiKey.trim(), url: url.trim() }
}

function send(obj) {
  process.stdout.write(`${JSON.stringify(obj)}\n`)
}

function sendError(id, code, message) {
  if (id === undefined || id === null) return
  send({ jsonrpc: '2.0', id, error: { code, message } })
}

function emitSse(text) {
  for (const block of text.split(/\r?\n\r?\n/)) {
    const data = block
      .split(/\r?\n/)
      .filter((line) => line.startsWith('data:'))
      .map((line) => line.slice(5).trimStart())
      .join('\n')
      .trim()
    if (!data || data === '[DONE]') continue
    try {
      send(JSON.parse(data))
    } catch {
      process.stderr.write(`[tradytics-mcp] ignored non-JSON SSE frame\n`)
    }
  }
}

const { apiKey, url } = parseArgs(process.argv.slice(2))
let sessionId = ''
let chain = Promise.resolve()

async function handleLine(raw) {
  const line = raw.trim()
  if (!line) return
  let msg
  try {
    msg = JSON.parse(line)
  } catch {
    sendError(null, -32700, 'Parse error')
    return
  }

  const hasId = Object.prototype.hasOwnProperty.call(msg, 'id') && msg.id !== undefined && msg.id !== null
  if (!apiKey) {
    if (hasId) {
      sendError(
        msg.id,
        -32001,
        'Missing TRADYTICS_API_KEY. Create a free key at https://tradytics.com/developer/keys or connect directly with OAuth at https://tradytics.com/mcp'
      )
    }
    return
  }

  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json, text/event-stream',
    Authorization: `Bearer ${apiKey}`,
    'User-Agent': `tradytics-mcp-js/${VERSION}`,
  }
  if (sessionId) headers['Mcp-Session-Id'] = sessionId

  try {
    const res = await fetch(url, { method: 'POST', headers, body: JSON.stringify(msg) })
    const sid = res.headers.get('mcp-session-id')
    if (sid) sessionId = sid

    if (res.status === 202 || res.status === 204) return

    const body = await res.text()
    if (!res.ok) {
      const detail = res.status === 401
        ? 'Unauthorized: check TRADYTICS_API_KEY at https://tradytics.com/developer/keys'
        : `HTTP ${res.status}: ${body.slice(0, 300)}`
      if (hasId) sendError(msg.id, -32000, detail)
      return
    }

    const trimmed = body.trim()
    if (!trimmed) return
    const ctype = (res.headers.get('content-type') || '').toLowerCase()
    if (ctype.includes('text/event-stream')) {
      emitSse(trimmed)
    } else {
      const parsed = JSON.parse(trimmed)
      if (Array.isArray(parsed)) {
        for (const item of parsed) send(item)
      } else {
        send(parsed)
      }
    }
  } catch (err) {
    if (hasId) sendError(msg.id, -32603, `Transport error: ${err instanceof Error ? err.message : String(err)}`)
  }
}

const rl = createInterface({ input: process.stdin, crlfDelay: Infinity })
rl.on('line', (line) => {
  chain = chain.then(() => handleLine(line))
})
rl.on('close', () => {
  chain.finally(() => process.exit(0))
})
