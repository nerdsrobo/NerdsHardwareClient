

export class Store<T> {
    public state: T;

    subers = new Set<(state: T) => void>();

    constructor(state: T) {
        this.state = state;
    }

    sub(listener: (state: T) => void) {
        this.subers.add(listener);
        return this.state;
    }

    set(state: T) {
        this.state = state;
        this.subers.forEach((suber => suber(state)));
    }
}

interface SubersOnEventBus {
    [key: string]: Set<(...args) => void>
}

class EventBus {
    subers: SubersOnEventBus = {};

    sub(channel: string, listener: (...args) => void) {
        if ( channel in this.subers ) { this.subers[channel].add(listener); }
        else { this.subers[channel] = new Set([listener]); }
    }

    emit(channel, ...args) {
        this.subers[channel]?.forEach((listener => listener(...args)));
    }

    log(record: string) {
        this.emit("log:log", record);
    }

    verbose(record: string) {
        this.emit("log:verbose", record);
    }
}

export const eventBus = new EventBus();