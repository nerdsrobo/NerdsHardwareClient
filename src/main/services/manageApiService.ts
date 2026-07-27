import { RcInfo } from "../../common/rcManagerTypes";
import { eventBus } from "../eventStoreBus";
import { TransportMain } from "../transport";
import { Service } from "./service";
import axios from 'axios';

export class ManageApiService extends Service {

    constructor(transport: TransportMain) {
        super(transport, "manageApi");

        this.regEvent("getRcInfo", async() => this.rcInfo());
        this.regEvent("changeNetworkSettings", async(_, name, password, wifiChannelName) => this.changeNetworkSettings(name, password, wifiChannelName));
        this.regEvent("reboot", async() => this.reboot());

    }

    async rcInfo() {
        try {
            return (await axios.get<RcInfo>("http://192.168.43.1:8080/js/rcInfo.json")).data;
        }
        catch (err) {
            if ( axios.isAxiosError(err) ) {
                eventBus.log(`get rcInfo failed with ${err.response?.status}`)
                eventBus.verbose(`get rcInfo failed with ${err.response?.data}`);
                return null;
            }
            else {
                eventBus.log(`get rcInfo with native error: ${err}`);
                return null;
            }
        }
    }

    async changeNetworkSettings(name: string, password: string, wifiChannelName: string) {
        try {
            await axios.post(`http://192.168.43.1:8080/changeNetworkSettings?name=${name}&password=${password}&channelName=${wifiChannelName}`);
            return true;
        }
        catch(err) {
            if ( axios.isAxiosError(err)) {
                eventBus.log(`post request to changeNetworkSettings failed with ${err.response?.status}`);
                eventBus.verbose(`post request to changeNetworkSettings failed with ${err.response?.data} ${JSON.stringify(err.toJSON())}`);
                return false;
            }
            else {
                eventBus.log(`post request to changeNetworkSettings failed with unexpected native error`);
                eventBus.verbose(`post request to changeNetworkSettings failed with native error: ${err}`);
                return false;
            }
        }
    }

    async reboot() {
        try {
            await axios.post(`http://192.168.43.1:8080/reboot`);
            return true;
        }
        catch(err) {
            if ( axios.isAxiosError(err)) {
                eventBus.log(`post request to reboot failed with ${err.response?.status}`);
                eventBus.verbose(`post request to reboot failed with ${err.response?.data}`);
                return false;
            }
            else {
                eventBus.log(`post request to reboot failed with unexpected native error`);
                eventBus.verbose(`post request to reboot failed with native error: ${err}`);
                return false;
            }
        }
    }

    public tick() {}

}