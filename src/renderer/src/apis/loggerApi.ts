import { Store } from "../store.svelte";
import type { TransportRenderer } from "../transport";
import { Api } from "./api";

export class LoggerApi extends Api {

    public records: Store<Array<String>> = new Store([]);

    constructor(transport: TransportRenderer) {
        super(transport, "logger");

        this.useEvent("getLogs").then((logs) => this.records.set(logs));

        this.listenToMessage("logsUpdated", (records) => this.records.set(records));
    }

    log(record: string) {
        this.sendMessage("log", record);
    }

    verbose(record: string) {
        this.sendMessage("verbose", record);
    }
}