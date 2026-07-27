import { Store } from "../eventStoreBus";
import { TransportMain } from "../transport";
import { NetworkInfo, PingerInfo, Settings } from "../../common/types";
import { Service } from "./service";

export class PingerService extends Service {

    settings: Settings;
    networkInfo: NetworkInfo;
    lastNetwork: string;

    pingerStore: Store<PingerInfo>;

    pingerEnabled: boolean;

    constructor(transport: TransportMain, settingsStore: Store<Settings>, networkStore: Store<NetworkInfo>, lastNetworkStore: Store<string>) {
        super(transport, "pinger");

        this.pingerStore = new Store<PingerInfo>({
            ch: {found: false, disabled: true, ssid: ''},
            dash: {found: false, disabled: true, ssid: ''}
        });
        
        this.regEvent("getPingerInfo", () => {return this.pingerStore.state});
        this.pingerStore.sub((pingerInfo) => {this.sendMessage("pingerInfoUpdated", pingerInfo)});

        this.pingerEnabled = false;

        this.settings = settingsStore.sub((settings => {this.settings = settings; this.updatePingerEnabled()}));
        this.networkInfo = networkStore.sub((networkInfo => {this.networkInfo = networkInfo; this.updatePingerEnabled()}));
        this.lastNetwork = lastNetworkStore.sub(lastNetwork => this.lastNetwork = lastNetwork);
    }

    fetchIsSuccess(url: string, callback: (success: boolean) => void) {
        fetch(url, { signal: AbortSignal.timeout(3000) })
            .then((_resp) => {callback(true);}, (_reason) => {callback(false)});
    }

    makePing() {
        this.fetchIsSuccess("http://192.168.43.1:8080", (success: boolean) => {
            if ( !this.pingerEnabled ) { return; }
            this.pingerStore.state.ch = 
            {
                found: success,
                disabled: false,
                ssid: this.lastNetwork
            };
            this.pingerStore.set(this.pingerStore.state);
        });
        this.fetchIsSuccess("http://192.168.43.1:8080/dash", (success: boolean) => {
            if ( !this.pingerEnabled ) { return; }
            this.pingerStore.state.dash = 
            {
                found: success,
                disabled: false,
                ssid: this.lastNetwork
            };
            this.pingerStore.set(this.pingerStore.state);
        });
    }
    
    updatePingerEnabled() {
        this.pingerEnabled = this.settings.autodetect &&
            ( 
                ( this.settings.autodetect_on_rc && this.networkInfo.ssid.includes("-RC") )
                || !this.settings.autodetect_on_rc
            )
        if ( !this.pingerEnabled ) {
            this.pingerStore.set({
                ch: {found: false, disabled: true, ssid: ''},
                dash: {found: false, disabled: true, ssid: ''}
            })
        }
    }

    public tick() {
        if ( this.pingerEnabled ) {
            this.makePing()
        }
    }
}