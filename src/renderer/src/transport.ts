

export abstract class TransportRenderer {
    public send: (event: string, ...args: any[]) => void;
    public on: (event: string, handler: (...args: any[]) => void) => void;
    public invoke: (event: string, ...args: any[]) => Promise<any>;

    constructor(send, on, invoke) {
        this.send = send;
        this.on = on;
        this.invoke = invoke
    }
}

export class TransportRendererIPC extends TransportRenderer {
    constructor(window: Window) {
        super(
            (channel, ...args) => {window.transport.send(channel, ...args)},
            (channel, listener) => {window.transport.on(channel, listener)},
            (channel, ...args) => {return window.transport.invoke(channel, ...args)}
        )
    } 
}