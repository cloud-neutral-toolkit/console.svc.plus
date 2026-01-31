export type VlessEndpoint = {
  host: string
  port: number
  type: string
  security: string
  flow: string
  encryption: string
  serverName: string
  fingerprint: string
  allowInsecure: boolean
  label: string
}

export type VlessTemplate = {
  endpoint: VlessEndpoint
}

const DEFAULT_VLESS_TEMPLATE: VlessTemplate = {
  endpoint: {
    host: 'ha-proxy-jp.svc.plus',
    port: 1443,
    type: 'tcp',
    security: 'tls',
    flow: 'xtls-rprx-vision',
    encryption: 'none',
    serverName: 'ha-proxy-jp.svc.plus',
    fingerprint: 'chrome',
    allowInsecure: false,
    label: 'TOKYO-NODE',
  },
}

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
}

export function buildVlessUri(rawUuid: string | null | undefined, node?: VlessNode): string | null {
  const uuid = (rawUuid ?? '').trim()
  if (!uuid) {
    return null
  }

  const { endpoint: defaultEndpoint } = DEFAULT_VLESS_TEMPLATE

  const host = node?.address ?? defaultEndpoint.host
  const port = node?.port ?? defaultEndpoint.port
  const serverName = node?.server_name ?? node?.address ?? defaultEndpoint.serverName
  const label = node?.name ?? defaultEndpoint.label
  const transport = node?.transport ?? (defaultEndpoint.type as VlessTransport)

  // Use node's flow if provided, otherwise default. For xhttp, flow is typically not used/empty.
  const flow = node?.flow ?? (transport === 'tcp' ? defaultEndpoint.flow : '')

  const params = new URLSearchParams({
    type: transport,
    security: defaultEndpoint.security,
    encryption: defaultEndpoint.encryption,
    sni: serverName,
    fp: defaultEndpoint.fingerprint,
    allowInsecure: defaultEndpoint.allowInsecure ? '1' : '0',
  })

  // Only add flow if it's not empty (e.g. for TCP vision)
  if (flow) {
    params.set('flow', flow)
  }

  if (transport === 'xhttp') {
    params.set('path', node?.path ?? '/split')
    params.set('mode', node?.mode ?? 'auto')
  }

  return `vless://${uuid}@${host}:${port}?${params.toString()}#${encodeURIComponent(label)}`
}

export function buildVlessConfig(rawUuid: string | null | undefined, node?: VlessNode): XrayConfig | null {
  const uuid = (rawUuid ?? '').trim()
  if (!uuid) {
    return null
  }

  const config = JSON.parse(JSON.stringify(DEFAULT_XRAY_CONFIG)) as XrayConfig
  const outbound = config.outbounds?.[0]
  const vnext = outbound?.settings?.vnext?.[0]
  const user = vnext?.users?.[0]

  const { endpoint: defaultEndpoint } = DEFAULT_VLESS_TEMPLATE
  const address = node?.address ?? defaultEndpoint.host
  const port = node?.port ?? defaultEndpoint.port
  const serverName = node?.server_name ?? node?.address ?? defaultEndpoint.serverName
  const transport = node?.transport ?? (defaultEndpoint.type as VlessTransport)
  const flow = node?.flow ?? (transport === 'tcp' ? defaultEndpoint.flow : '')

  if (vnext) {
    vnext.address = address
    vnext.port = port
  }
  if (user) {
    user.id = uuid
    if (flow) {
      user.flow = flow
    } else {
      // Remove flow if not applicable (e.g. xhttp) or empty
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
        path: node?.path ?? '/split'
      }
    }
  }

  return config
}

export function serializeConfigForDownload(config: XrayConfig): string {
  return `${JSON.stringify(config, null, 2)}\n`
}

export const DEFAULT_VLESS_LABEL = DEFAULT_VLESS_TEMPLATE.endpoint.label
