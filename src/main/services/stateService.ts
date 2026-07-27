import { /*eventBus, */Store } from "../eventStoreBus";
import { TransportMain } from "../transport";
import { NetworkInfo, ConnectionState, PingerInfo, StateString } from "../../common/types";
import { Service } from "./service";

export class StateService extends Service {

    networkInfo: NetworkInfo;
    pingerInfo: PingerInfo;
    connectionState: ConnectionState;
    disconnectedAtThatNetwork: boolean;

    stateStore: Store<StateString>;

    constructor(transport: TransportMain, networkStore: Store<NetworkInfo>, pingerStore: Store<PingerInfo>, connectionStateStore: Store<ConnectionState>, disconnectedAtThatNetworkStore: Store<boolean>) {
        super(transport, "state");

        this.stateStore = new Store<StateString>(StateString.Idle);
        this.stateStore.sub((state) => {/*eventBus.verbose("state updated: " + state.toString());*/ this.sendMessage("stateUpdated", state)});

        this.networkInfo = networkStore.sub((networkInfo) => {this.networkInfo = networkInfo; this.updateStateString()});
        this.pingerInfo = pingerStore.sub((pingerInfo) => {this.pingerInfo = pingerInfo; this.updateStateString()});
        this.connectionState = connectionStateStore.sub((connectionState) => {this.connectionState = connectionState; this.updateStateString()});
        this.disconnectedAtThatNetwork = disconnectedAtThatNetworkStore.sub((disconnectedAtThatNetwork) => {this.disconnectedAtThatNetwork = disconnectedAtThatNetwork; this.updateStateString()})
    }

    updateStateString() {
            if ( this.connectionState == ConnectionState.Connected ) { this.stateStore.set(StateString.Connected); }
            else if ( this.connectionState == ConnectionState.Connecting ) { this.stateStore.set(StateString.Connecting); }
            else if ( this.connectionState == ConnectionState.ConnectionError || this.connectionState == ConnectionState.DisconnectionError ) { this.stateStore.set(StateString.Error); }
            else if ( !this.networkInfo.found ) { this.stateStore.set(StateString.NetworkNotFound); }
            else if ( this.networkInfo.found && this.connectionState == ConnectionState.Disconnected && !this.disconnectedAtThatNetwork ) {
                if ( this.pingerInfo.ch.disabled ) { this.stateStore.set(StateString.Disabled); }
                else if ( this.pingerInfo.ch.found ) { this.stateStore.set(StateString.Detected); }
                else { this.stateStore.set(StateString.NetworkChanged); }
            }
            else if ( this.connectionState == ConnectionState.Disconnected && this.disconnectedAtThatNetwork ) { this.stateStore.set(StateString.Disconnected); }
            else { this.stateStore.set(StateString.Idle); }
        }

    public tick() {}
}