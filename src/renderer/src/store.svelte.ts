export class Store<T> {
    public state: T;

    subers = new Set<(state: T) => void>();

    constructor(state: T) {
        this.state = $state(state);
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