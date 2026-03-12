declare module "ws" {
  export type MessageData =
    | string
    | ArrayBuffer
    | Buffer
    | Buffer[]
    | ArrayBufferView

  export type ClientOptions = {
    headers?: Record<string, string>
  }

  export default class WebSocket {
    static readonly CONNECTING: number
    static readonly OPEN: number
    static readonly CLOSING: number
    static readonly CLOSED: number

    readonly readyState: number

    constructor(address: string | URL, options?: ClientOptions)

    on(event: "open", listener: () => void): this
    on(event: "close", listener: () => void): this
    on(event: "error", listener: (error: Error) => void): this
    on(event: "message", listener: (data: MessageData) => void): this

    once(event: "open", listener: () => void): this
    once(event: "close", listener: () => void): this
    once(event: "error", listener: (error: Error) => void): this

    off(event: "open", listener: () => void): this
    off(event: "close", listener: () => void): this
    off(event: "error", listener: (error: Error) => void): this
    off(event: "message", listener: (data: MessageData) => void): this

    send(data: string): void
    close(): void
  }
}
