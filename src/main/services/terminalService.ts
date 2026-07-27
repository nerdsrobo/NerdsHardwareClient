import { TerminalRecord } from "../../common/types";
import { eventBus, Store } from "../eventStoreBus";
import { Executor } from "../execShell";
import { TransportMain } from "../transport";
import { Service } from "./service";


export class TerminalService extends Service {

    executor: Executor;

    terminalStore: Store<Array<TerminalRecord>>;

    constructor(transport: TransportMain, executor: Executor) {
        super(transport, "terminal");

        this.executor = executor;

        this.terminalStore = new Store<Array<TerminalRecord>>([]);
        this.terminalStore.sub((records) => {this.sendMessage("recordsUpdated", records)});

        eventBus.sub("terminal:addRecord", (record: TerminalRecord) => this.addRecord(record));

        this.listenToMessage("exec", (cmd: string) => this.executeCommand(cmd));
        this.listenToMessage("clear", () => this.clear());
    }

    executeCommand(cmd: string) {
        this.executor.execute(cmd, (_err, stdout, stderr) => {
            eventBus.verbose("terminal execute result - stdout: " + stdout + " stderr: " + stderr);
            this.addRecord({
                stdin: cmd,
                stdout: stderr ? stderr : stdout,
                isErr: stderr ? true : false,
                isUser: true
            })
        })
    }

    clear() {
        eventBus.verbose("terminal records cleared");
        this.terminalStore.set([]);
    }

    addRecord(record: TerminalRecord) {
        this.terminalStore.state.push(record);
        this.terminalStore.set(this.terminalStore.state);
    }

    public tick() {}
}