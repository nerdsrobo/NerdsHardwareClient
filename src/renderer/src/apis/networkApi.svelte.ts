import type { TransportRenderer } from "../transport";
import { Api } from "./api";
import type { NetworkInfo } from "../../../common/types";

export class NetworkApi extends Api {

    networkInfo: NetworkInfo = $state({
        ssid: "",
        found: false
    });

    constructor(transport: TransportRenderer) {
        super(transport, "network");

        this.useEvent("getNetwork").then((networkInfo: NetworkInfo) => this.networkInfo = networkInfo);
        
        this.listenToMessage("networkUpdated", (networkInfo) => {this.networkInfo = networkInfo});
    }

    
}