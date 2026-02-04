// Technical constants for VLESS protocol
const VLESS_DEFAULTS = {
  fingerprint: 'chrome',
  tcpFlow: 'xtls-rprx-vision',
} as const

const DEFAULT_XRAY_CONFIG = {
  log: {
    loglevel: 'info',
  },
  routing: {
    domainStrategy: 'IPIfNonMatch',
    rules: [
      {
        type: 'field',
        ip: ['geoip:private', 'geoip:cn'],
        outboundTag: 'direct',
      },
      {
        type: 'field',
        domain: ['geosite:cn'],
        outboundTag: 'direct',
      },
      {
        type: 'field',
        network: 'tcp,udp',
        outboundTag: 'proxy',
      },
    ],
  },
  inbounds: [
    {
      listen: '127.0.0.1',
      port: 1080,
      protocol: 'socks',
      settings: {
        udp: true,
      },
      sniffing: {
        enabled: true,
        destOverride: ['http', 'tls'],
      },
    },
    {
      listen: '127.0.0.1',
      port: 1081,
      protocol: 'http',
      sniffing: {
        enabled: true,
        destOverride: ['http', 'tls'],
      },
    },
  ],
  outbounds: [
    {
      protocol: 'vless',
      settings: {
        vnext: [
          {
            address: 'ha-proxy-jp.svc.plus',
            port: 1443,
            users: [
              {
                id: '',
                encryption: 'none',
                flow: 'xtls-rprx-vision',
              },
            ],
          },
        ],
      },
      streamSettings: {
        network: 'tcp',
        security: 'tls',
        tlsSettings: {
          serverName: 'ha-proxy-jp.svc.plus',
          allowInsecure: false,
          fingerprint: 'chrome',
        },
      },
      tag: 'proxy',
    },
    {
      protocol: 'freedom',
      tag: 'direct',
    },
    {
      protocol: 'blackhole',
      tag: 'block',
    },
  ],
}

export type XrayConfig = typeof DEFAULT_XRAY_CONFIG

export type VlessTransport = 'tcp' | 'xhttp'

export type VlessNode = {
  name: string
  address: string
  port: number
  server_name?: string
  protocols?: string | string[]
  transport?: VlessTransport
  path?: string
  mode?: string
  flow?: string
  xhttp_port?: number
  tcp_port?: number
  uri_scheme_xhttp?: string
  uri_scheme_tcp?: string
}

function resolveTransportPort(node: VlessNode | undefined, transport: VlessTransport, fallback: number): number {
  const byTransport = transport === 'xhttp' ? node?.xhttp_port : node?.tcp_port
  const byNodePort = node?.transport === transport ? node?.port : undefined
  const port = byTransport ?? byNodePort

  if (typeof port === 'number' && Number.isFinite(port) && port > 0) {
    return port
  }

  return fallback
}

function renderVlessUriFromScheme(scheme: string, values: Record<string, string>): string | null {
  const template = scheme.trim()
  if (!template || !template.toLowerCase().startsWith('vless://')) {
    return null
  }

  let rendered = template
  for (const [key, value] of Object.entries(values)) {
    rendered = rendered.split('${' + key + '}').join(value)
  }

  return rendered
}

export function buildVlessUri(rawUuid: string | null | undefined, node?: VlessNode): string | null {
  const uuid = (rawUuid ?? '').trim()
  if (!uuid) {
    return null
  }

  if (!node) {
    console.error('[VLESS] Cannot build URI: node is undefined')
    return null
  }

  if (!node.transport) {
    console.error('[VLESS] Missing transport type from node:', node.name || node.address)
    return null
  }

  const transport = node.transport
  const schemeTemplate = transport === 'xhttp' ? node.uri_scheme_xhttp : node.uri_scheme_tcp

  if (!schemeTemplate) {
    console.error(
      `[VLESS] Missing URI scheme template from server for transport: ${transport}. ` +
      `Node: ${node.name || node.address}. ` +
      `Please ensure accounts.svc.plus is returning uri_scheme_tcp and uri_scheme_xhttp fields.`
    )
    return null
  }

  const host = node.address
  const serverName = node.server_name ?? node.address
  const label = node.name || node.address
  const flow = node.flow ?? (transport === 'tcp' ? VLESS_DEFAULTS.tcpFlow : '')

  return renderVlessUriFromScheme(schemeTemplate, {
    UUID: uuid,
    DOMAIN: host,
    NODE: host,
    PATH: encodeURIComponent(node.path ?? '/split'),
    MODE: encodeURIComponent(node.mode ?? 'auto'),
    SNI: serverName,
    FP: VLESS_DEFAULTS.fingerprint,
    FLOW: flow || VLESS_DEFAULTS.tcpFlow,
    TAG: encodeURIComponent(label),
  })
}

export function buildVlessConfig(rawUuid: string | null | undefined, node?: VlessNode): XrayConfig | null {
  const uuid = (rawUuid ?? '').trim()
  if (!uuid || !node) {
    return null
  }

  const config = JSON.parse(JSON.stringify(DEFAULT_XRAY_CONFIG)) as XrayConfig
  const outbound = config.outbounds?.[0]
  const vnext = outbound?.settings?.vnext?.[0]
  const user = vnext?.users?.[0]

  const address = node.address
  const serverName = node.server_name ?? node.address
  const transport = node.transport ?? 'tcp'
  const flow = node.flow ?? (transport === 'tcp' ? VLESS_DEFAULTS.tcpFlow : '')
  const port = resolveTransportPort(node, transport, transport === 'xhttp' ? 443 : 1443)

  if (vnext) {
    vnext.address = address
    vnext.port = port
  }
  if (user) {
    user.id = uuid
    if (flow) {
      user.flow = flow
    } else {
      delete (user as any).flow
    }
  }

  if (outbound && outbound.streamSettings) {
    outbound.streamSettings.network = transport
    if (outbound.streamSettings.tlsSettings) {
      outbound.streamSettings.tlsSettings.serverName = serverName
    }

    if (transport === 'xhttp') {
      // @ts-ignore - Adding xhttpSettings to outbounds[0].streamSettings
      outbound.streamSettings.xhttpSettings = {
        mode: node?.mode ?? 'auto',
        path: node?.path ?? '/split',
      }
    }
  }

  return config
}

export function serializeConfigForDownload(config: XrayConfig): string {
  return `${JSON.stringify(config, null, 2)}\n`
}


