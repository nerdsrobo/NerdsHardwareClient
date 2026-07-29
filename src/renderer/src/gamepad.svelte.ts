import type { GamepadState } from "../../common/dashboardTypes";
import { Store } from "./store.svelte";

export class GamepadService {

    gamepads: Store<Array<GamepadState | null>>;
    isGamepadConnected: boolean = $state(false);
    gamepadsIds: Array<string> = $state(['', '', '', '']);

    updateTs: number = Date.now();

    ping = $state(false);

    constructor() {
        this.gamepads = new Store([null, null, null, null]);
    }

    updateGamepadStatus() {
        this.updateTs = Date.now();
        if ( !this.ping ) { setTimeout(() => this.updateGamepadStatus(), 6700); return; }
        let gm: Array<GamepadState | null> = [];
        let gmIds: Array<string> = [];
        let gmConnected = false;
        console.log(navigator.getGamepads())
        navigator.getGamepads().forEach(gamepad => {
            if ( gamepad ) {
                gmConnected = true;
                gm.push({
                    left_stick_x: gamepad.axes[0],
                    left_stick_y: gamepad.axes[1],
                    right_stick_x: gamepad.axes[2],
                    right_stick_y: gamepad.axes[3],
                    dpad_up: gamepad.buttons[12].pressed,
                    dpad_down: gamepad.buttons[13].pressed,
                    dpad_left: gamepad.buttons[14].pressed,
                    dpad_right: gamepad.buttons[15].pressed,
                    a: gamepad.buttons[0].pressed,
                    b: gamepad.buttons[1].pressed,
                    x: gamepad.buttons[2].pressed,
                    y: gamepad.buttons[3].pressed,
                    guide: gamepad.buttons[16].pressed,
                    start: gamepad.buttons[9].pressed,
                    back: gamepad.buttons[8].pressed,
                    left_bumper: gamepad.buttons[4].pressed,
                    right_bumper: gamepad.buttons[5].pressed,
                    left_stick_button: gamepad.buttons[10].pressed,
                    right_stick_button: gamepad.buttons[11].pressed,
                    left_trigger: gamepad.buttons[6].value,
                    right_trigger: gamepad.buttons[7].value
                });
                gmIds.push(gamepad.id);
            } else { gm.push(null); gmIds.push(''); }
        });
        this.isGamepadConnected = gmConnected;
        this.gamepads.set(gm);
        this.gamepadsIds = gmIds;
        setTimeout(() => this.updateGamepadStatus(), this.isGamepadConnected ? 16 : 600);
    }
}

