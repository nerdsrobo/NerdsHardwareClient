import { clearGamepad, OpModeStatus, type GamepadState, type RobotStatus } from "../../../common/dashboardTypes";
import type { PingerInfo } from "../../../common/types";
import { GamepadService } from "../gamepad.svelte";
import type { TransportRenderer } from "../transport";
import { Api } from "./api";
import type { LoggerApi } from "./loggerApi";
import type { PingerApi } from "./pingerApi";


export class FtcDashboardApi extends Api {

    loggerApi: LoggerApi;
    gamepadService: GamepadService;

    pingerInfo: PingerInfo;

    gamepad1Index = $state(-1);
    gamepad2Index = $state(-1);

    opModeList: Array<string> = $state([]);
    selectedOpModeIndex: number = $state(-1);
    robotStatus: RobotStatus = $state({
        activeOpMode: "$Stop$Robot$", activeOpModeStatus: OpModeStatus.STOPPED, warningMessage: '', errorMessage: '', batteryVoltage: 0, pingMs: 0
    });
    isWsOpened = $state(false);
    isWsCommandReady = $state(false);

    keyboardGamepadEmulatorGamepadState: GamepadState = $state({
        left_stick_x: 0, left_stick_y: 0, right_stick_x: 0, right_stick_y: 0,
        dpad_up: false, dpad_down: false, dpad_left: false, dpad_right: false,
        a: false, b: false, x: false, y: false,
        guide: false, start: false, back: false,
        left_bumper: false, right_bumper: false,
        left_stick_button: false, right_stick_button: false,
        left_trigger: 0, right_trigger: 0
    })

    constructor(transport: TransportRenderer, loggerApi: LoggerApi, pingerApi: PingerApi) {
        super(transport, "ftcDashboard");

        this.gamepadService = new GamepadService();
        this.gamepadService.updateGamepadStatus();

        this.syncVal("opModeList", (opModeList: Array<string>) => this.opModeList = opModeList);
        this.syncVal("robotStatus", (robotStatus: RobotStatus) => this.robotStatus = robotStatus);
        this.syncVal("isOpened", (isOpened: boolean) => this.isWsOpened = isOpened);
        this.syncVal("isCommandReady", state => this.isWsCommandReady = state);

        this.gamepadService.gamepads.sub((gamepads) => {this.gamepadsUpdated($state.snapshot(gamepads))})        

        this.loggerApi = loggerApi;
        pingerApi.pingerInfo.sub(pingerInfo => {this.pingerInfo = pingerInfo; this.checkIsGamepadServiceAlive(); })
    }

    checkIsGamepadServiceAlive() {
        if ( Date.now() - this.gamepadService.updateTs > 9321 ) { this.loggerApi.log("seems like gamepad service falls, restart it"); this.gamepadService.updateGamepadStatus(); }
    }

    getGamepadStateSafe(gamepads: Array<GamepadState | null>, gmIndex: number): GamepadState {
        if ( gmIndex == -2 ) { return $state.snapshot(this.keyboardGamepadEmulatorGamepadState); }
        if ( gamepads.length - 1 < gmIndex || gmIndex < 0 ) { return clearGamepad; }
        if ( !gamepads[gmIndex] ) { return clearGamepad; }
        return gamepads[gmIndex];
    }
    gamepadsUpdated(gamepads: Array<GamepadState | null>) {
        if ( this.keyboardGamepadEmulatorGamepadState.start && this.keyboardGamepadEmulatorGamepadState.a ) {
            this.gamepad1Index = -2;
            this.keyboardGamepadEmulatorGamepadState.start = false; this.keyboardGamepadEmulatorGamepadState.a = false;
            if ( this.gamepad2Index == -2 ) { this.gamepad2Index = -1 }
        } 
        if ( this.keyboardGamepadEmulatorGamepadState.start && this.keyboardGamepadEmulatorGamepadState.b ) {
            this.gamepad2Index = -2;
            this.keyboardGamepadEmulatorGamepadState.start = false; this.keyboardGamepadEmulatorGamepadState.b = false;
            if ( this.gamepad1Index == -2 ) { this.gamepad1Index = -1 }
        }
        gamepads.forEach((gamepad, i) => {
            if ( !gamepad ) { return; }
            if ( gamepad.start && gamepad.a ) {
                this.gamepad1Index = i;
                gamepad.start = false; gamepad.a = false;
                if ( this.gamepad2Index == i ) { this.gamepad2Index = -1 }
            }
            if ( gamepad.start && gamepad.b ) {
                this.gamepad2Index = i;
                gamepad.start = false; gamepad.b = false;
                if ( this.gamepad1Index == i ) { this.gamepad1Index = -1 }
            }
        });
        if ( !this.isWsOpened || !this.isWsCommandReady ) {return;}
        this.sendMessage("gamepads123", {
            gamepad1: this.getGamepadStateSafe(gamepads, this.gamepad1Index),
            gamepad2: this.getGamepadStateSafe(gamepads, this.gamepad2Index)
        });
    }

    initOpMode(): boolean {
        if ( !(this.opModeList.length - 1 < this.selectedOpModeIndex) && this.selectedOpModeIndex > -1 ) {
            this.sendMessage("initOpMode", this.selectedOpModeIndex);
            return true;
        }
        return false;
    }
    startOpMode() {
        this.sendMessage("startOpMode");
    }
    stopOpMode() {
        this.sendMessage("stopOpMode");
    }
}
