import type { PingerInfo } from "../../../common/types";
import { Store } from "../store.svelte";
import type { TransportRenderer } from "../transport";
import { Api } from "./api";

export class PingerApi extends Api {

    public pingerInfo: Store<PingerInfo> = new Store({
        ch: {found: false, disabled: true, ssid: ''},
        dash: {found: false, disabled: true, ssid: ''}
    });

    constructor(transport: TransportRenderer) {
        super(transport, "pinger");

        this.useEvent("getPingerInfo").then((pingerInfo) => this.pingerInfo.set(pingerInfo));

        this.listenToMessage("pingerInfoUpdated", (pingerInfo) => {this.pingerInfo.set(pingerInfo)});
    }
}