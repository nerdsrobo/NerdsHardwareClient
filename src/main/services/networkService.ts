import { exec } from "child_process";
import { eventBus, Store } from "../eventStoreBus";
import { TransportMain } from "../transport";
import { Service } from "./service";
import { platform } from "process";
import { NetworkInfo } from "../../common/types";

export class NetworkService extends Service {

    public networkStore: Store<NetworkInfo>;
    public lastNetworkStore: Store<string>;
    public disconnectedAtThatNetwork: Store<boolean>;

    getNetwork: (callback: (networkInfo: NetworkInfo) => void) => void = this.getNetworkWin32;

    constructor(transport: TransportMain) {
        super(transport, "network");

        switch ( platform ) {
            case "win32":
                this.getNetwork = this.getNetworkWin32;
                break;
            case "linux":
                this.getNetwork = this.getNetworkLinux;
                break;
            case "darwin":
                this.getNetwork = this.getNetworkDarwin;
                break;
        }

        eventBus.sub("network:adbDisconnected", () => {this.disconnectedAtThatNetwork.set(true)});

        this.networkStore = new Store<NetworkInfo>({ssid: '', found: false});
        this.networkStore.sub((networkInfo) => this.sendMessage("networkUpdated", networkInfo));

        this.regEvent("getNetwork", () => {return this.networkStore.state});

        this.lastNetworkStore = new Store('');
        this.disconnectedAtThatNetwork = new Store(false);
    }

    getNetworkWin32(callback: (networkInfo: NetworkInfo) => void) {
        exec("netsh wlan show interfaces", (_err, stdout, _stderr) => {
            // eventBus.verbose("network win cmd result - stdout: " + stdout + " stderr: " + stderr);
            let found = false;
            stdout.split("\r\n").forEach(line => {
                if ( line.split(":")[0].includes(" SSID ") ) {
                    found = true;
                    callback({
                        ssid: line.split(":")[1].trim(),
                        found: true
                    })
                }
            })
            if ( !found ) {
                eventBus.verbose("network not found");
                callback({ssid: '', found: false});
            }
        })
    }

    getNetworkLinux(callback: (networkInfo: NetworkInfo) => void) {
        exec("iwgetid -r", (_err, stdout, _stderr) => {
            // eventBus.verbose("network linux cmd result - stdout: " + stdout + " stderr: " + stderr);
            if ( stdout ) {
                callback({ssid: stdout, found: true});
            }
            else {
                eventBus.verbose("network not found");
                callback({ssid: '', found: false});
            }
        })
    }

    getNetworkDarwin(callback: (networkInfo: NetworkInfo) => void) { callback({ssid: '', found: false}) }

    updateNetwork() {
        this.getNetwork((networkInfo: NetworkInfo) => this.proccessNetwork(networkInfo));
    }

    proccessNetwork(networkInfo: NetworkInfo) {
        if ( this.lastNetworkStore.state != networkInfo.ssid ) { eventBus.log("network updated: " + networkInfo.ssid); eventBus.emit("adb:networkUpdated"); this.disconnectedAtThatNetwork.set(false); }
        this.networkStore.set(networkInfo);
        this.lastNetworkStore.set(networkInfo.ssid);
    }

    public tick() {
        this.updateNetwork();
    }
}