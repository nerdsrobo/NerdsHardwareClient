import type { RcInfo, WiFiChannel } from "../../../common/rcManagerTypes";
import { Store } from "../store.svelte";
import type { TransportRenderer } from "../transport";
import { Api } from "./api";
import type { LoggerApi } from "./loggerApi";


export class ManageApiApi extends Api {

    rcInfoStore: Store<RcInfo|null> = new Store(null);
    rcInfoGetterErr = $state(false);
    loggerApi: LoggerApi;

    constructor(transport: TransportRenderer, loggerApi: LoggerApi) {
        super(transport, "manageApi");

        this.loggerApi = loggerApi;
    }

    getRcInfo() {
        this.useEvent("getRcInfo").then(rcInfo => {
            this.rcInfoGetterErr = rcInfo ? false : true;
            this.rcInfoStore.set(rcInfo);
        }, _reason => {
            this.rcInfoGetterErr = true;
            this.rcInfoStore.set(null);
        });
    }

    changeNetwowrkInfo(name: string, password: string, wifiChannel: WiFiChannel) {
        this.useEvent("changeNetworkSettings", name, password, wifiChannel.name).then(result => {
            this.loggerApi.log(result ? "Hub network successfuly changed" : "Error occured while hub network change")
        }, reason => {
            this.loggerApi.log(`Error occured while hub network change: ${reason}`)
        })
    }

    requestReboot() {
        this.useEvent("reboot");
    }
}

