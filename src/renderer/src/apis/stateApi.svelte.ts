import type { TransportRenderer } from "../transport";
import { Api } from "./api";
import { StateString } from "../../../common/types";

export class StateApi extends Api {

    state: StateString = $state(StateString.Idle);

    constructor(transport: TransportRenderer) {
        super(transport, "state");

        this.listenToMessage("stateUpdated", (state) => this.state = state);
    }   
}