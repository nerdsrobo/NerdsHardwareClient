export enum OpModeStatus {
    INIT,
    RUNNING,
    STOPPED
}

export interface RobotStatusDash {
    enabled: boolean,
    available: boolean,
    activeOpMode: string,
    activeOpModeStatus: OpModeStatus,
    warningMessage: string,
    errorMessage: string,
    batteryVoltage: number
}

export interface RobotStatus {
    activeOpMode: string,
    activeOpModeStatus: OpModeStatus,
    warningMessage: string,
    errorMessage: string,
    batteryVoltage: number,
    pingMs: number
}

export interface OpModeInfo {
    name: string,
    group: string
}

export enum MessageType {
    GET_ROBOT_STATUS, RECEIVE_ROBOT_STATUS,

    /* op mode management */
    INIT_OP_MODE, START_OP_MODE, STOP_OP_MODE, RECEIVE_OP_MODE_LIST,

    /* config */
    GET_CONFIG, GET_CONFIG_BASELINE, SAVE_CONFIG, RECEIVE_CONFIG, RECEIVE_CONFIG_BASELINE,

    /* telemetry */
    RECEIVE_TELEMETRY,

    /* camera */
    RECEIVE_IMAGE,

    /* gamepad */
    RECEIVE_GAMEPAD_STATE,

    /* hardware config */
    RECEIVE_HARDWARE_CONFIG_LIST, SET_HARDWARE_CONFIG, WRITE_HARDWARE_CONFIG, DELETE_HARDWARE_CONFIG,

    /* logcat errors */
    RECEIVE_LOGCAT_ERRORS
}

export interface GamepadState {
    [key: string]: number | boolean | undefined
    left_stick_x: number,
    left_stick_y: number,
    right_stick_x: number,
    right_stick_y: number,

    dpad_up: boolean,
    dpad_down: boolean,
    dpad_left: boolean,
    dpad_right: boolean,

    a: boolean,
    b: boolean,
    x: boolean,
    y: boolean,

    guide: boolean,
    start: boolean,
    back: boolean,

    left_bumper: boolean,
    right_bumper: boolean,

    left_stick_button: boolean,
    right_stick_button: boolean,

    left_trigger: number,
    right_trigger: number,

    touchpad?: boolean
}

export interface GamepadsState {
    gamepad1: GamepadState,
    gamepad2: GamepadState
}

export const clearGamepad: GamepadState = {
    left_stick_x: 0, left_stick_y: 0, right_stick_x: 0, right_stick_y: 0,
    dpad_up: false, dpad_down: false, dpad_left: false, dpad_right: false,
    a: false, b: false, x: false, y: false,
    guide: false, start: false, back: false,
    left_bumper: false, right_bumper: false,
    left_stick_button: false, right_stick_button: false,
    left_trigger: 0, right_trigger: 0
}

export interface GamepadConnectionState {
    gamepad1Connected: boolean,
    gamepad2Connected: boolean
}

export interface Message {
    type: string
}

export interface MessageRecieveOpModeList {
    type: string,
    opModeList: Array<string>
}

export interface MessageRecieveRobotStatus {
    type: string,
    status: RobotStatusDash
}
