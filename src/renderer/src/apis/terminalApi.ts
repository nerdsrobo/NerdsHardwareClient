import type { TransportRenderer } from "../transport";
import { Api } from "./api";
import type { TerminalRecord } from "../../../common/types";
import { Store } from "../store.svelte";

export class TerminalApi extends Api {

    public records: Store<Array<TerminalRecord>> = new Store([]);

    constructor(transport: TransportRenderer) {
        super(transport, "terminal");

        this.listenToMessage("recordsUpdated", (records) => {this.records.set(records)});
    }

    execute(cmd: string) {
        this.sendMessage("exec", cmd);
    }

    clear() {
        this.sendMessage("clear");
    }
}