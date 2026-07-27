import { eventBus, Store } from "../eventStoreBus";
import { TransportMain } from "../transport";
import { Service } from "./service";
import log from 'electron-log/main';


export class LoggerService extends Service {

    logStore: Store<Array<string>>;

    constructor(transport: TransportMain) {
        super(transport, "logger");

        log.initialize(); 

        this.logStore = new Store<Array<string>>([]);
        this.logStore.sub((records) => this.sendMessage("logsUpdated", records));

        this.regEvent("getLogs", () => this.logStore.state);

        eventBus.sub("log:log", (record) => this.addLog("m : " + record, false));
        eventBus.sub("log:verbose", record => this.addLog("m : " + record, true));

        this.listenToMessage("log", (record: string) => this.addLog("r : " + record, false));
        this.listenToMessage("verbose", record => this.addLog("r : " + record, true));
    }

    addLog(record: string, isVerbose: boolean) {
        if ( !isVerbose ) {
            log.info(record);
            this.logStore.state.push(new Date().toLocaleTimeString() + " : " + record);
            this.logStore.set(this.logStore.state);
            return;
        }
        log.verbose(record);
    }

    public tick() {}
}