import type { TransportRenderer } from "../transport";

export abstract class Api {

    transport: TransportRenderer;
    channel: string;

    constructor(transport: TransportRenderer, channel: string) {
        this.transport = transport;
        this.channel = channel;
    }

    listenToMessage(name: string, callback: (...args: any[]) => void) {
        this.transport.on(this.channel+name, (_e, ...args) => {callback(...args)});
    }

    sendMessage(name: string, ...args: any[]) {
        this.transport.send(this.channel+name, ...args);
    }

    useEvent(name: string, ...args: any[]) {
        return this.transport.invoke(this.channel + name, ...args);
    }

    syncVal(name: string, setter: (state) => void) {
        this.useEvent(`get-${name}`).then(state => setter(state));
        this.listenToMessage(`update-${name}`, setter);
    }
}