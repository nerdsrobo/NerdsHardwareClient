import type { TransportRenderer } from "../transport";
import { Api } from "./api";


export class AdbApi extends Api {

    constructor(transport: TransportRenderer) {
        super(transport, "adb");
    }

    connect() {
        this.sendMessage("connect");
    }

    disconnect() {
        this.sendMessage("disconnect");
    }
}