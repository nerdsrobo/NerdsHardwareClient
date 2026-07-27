import { Store } from "../eventStoreBus";
import { TransportMain } from "../transport";


export abstract class Service {

    transport: TransportMain;
    channel: string;

    constructor(transport: TransportMain, channel: string) {
        this.transport = transport;
        this.channel = channel;
    }

    listenToMessage(name: string, callback: (...args: any[]) => void) {
        this.transport.on(this.channel+name, (_e, ...args) => callback(...args));
    }

    sendMessage(name: string, ...args: any[]) {
        this.transport.send(this.channel+name, ...args);
    }

    regEvent(name: string, callback: (...args: any[]) => Promise<any> | any) {
        this.transport.handle(this.channel + name, callback);
    }

    createAndSyncStore<T>(name: string, startVal: T): Store<T> {
        const store = new Store<T>(startVal);
        store.sub(state => this.sendMessage(`update-${name}`, state));
        this.regEvent(`get-${name}`, () => store.state);
        return store;
    }

    abstract tick(): void;

}