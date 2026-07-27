

export interface NetworkInfo {
    ssid: string,
    found: boolean
}

export enum ConnectionState {
    Connected, Disconnected, ConnectionError, Connecting, DisconnectionError
}

interface SinglePingerInfo {
    found: boolean,
    disabled: boolean,
    ssid: string
}

export interface PingerInfo {
    ch: SinglePingerInfo,
    dash: SinglePingerInfo
}

export interface Settings {
    [key: string]: any;
    autodetect: boolean,
    autodetect_on_rc: boolean,
    autodetect_ch: boolean,
    autodetect_dash: boolean,
    display_dash: boolean,
    adb_autoconnect: boolean,
    use_dashboard_on_main_page: boolean,
    keyboardGamepadEmulatorMapping: {
        left_stick_x_positive: number,
        left_stick_x_positive_half: number,
        left_stick_x_negative: number,
        left_stick_x_negative_half: number,
        left_stick_y_positive: number,
        left_stick_y_positive_half: number,
        left_stick_y_negative: number,
        left_stick_y_negative_half: number,
        right_stick_x_positive: number,
        right_stick_x_positive_half: number,
        right_stick_x_negative: number,
        right_stick_x_negative_half: number,
        right_stick_y_positive: number,
        right_stick_y_positive_half: number,
        right_stick_y_negative: number,
        right_stick_y_negative_half: number,
        dpad_up: number,
        dpad_down: number,
        dpad_left: number,
        dpad_right: number,
        a: number,
        b: number,
        x: number,
        y: number,
        guide: number,
        start: number,
        back: number,
        left_bumper: number,
        right_bumper: number,
        left_stick_button: number,
        right_stick_button: number,
        left_trigger: number,
        right_trigger: number,
    }
}
export const defaultSettings: Settings = {
        autodetect: false,
        autodetect_on_rc: false,
        autodetect_ch: false,
        autodetect_dash: false,
        adb_autoconnect: false,
        display_dash: true,
        use_dashboard_on_main_page: false,
        keyboardGamepadEmulatorMapping: {
            left_stick_x_positive: 68,
            left_stick_x_positive_half: 74,
            left_stick_x_negative: 65,
            left_stick_x_negative_half: 71,
            left_stick_y_positive: 83,
            left_stick_y_positive_half: 89,
            left_stick_y_negative: 87,
            left_stick_y_negative_half: 72,
            right_stick_x_positive: 39,
            right_stick_x_positive_half: 190,
            right_stick_x_negative: 37,
            right_stick_x_negative_half: 77,
            right_stick_y_positive: 40,
            right_stick_y_positive_half: 188,
            right_stick_y_negative: 38,
            right_stick_y_negative_half: 75,
            dpad_up: 219,
            dpad_down: 222,
            dpad_left: 186,
            dpad_right: 221,
            a: 70,
            b: 88,
            x: 67,
            y: 86,
            guide: 220,
            start: 16,
            back: 13,
            left_bumper: 81,
            right_bumper: 69,
            left_stick_button: 49,
            right_stick_button: 50,
            left_trigger: 82,
            right_trigger: 84,
        }
    }

export enum StateString {
    Idle, Detected, Connecting, Disabled, Connected, Disconnected, Error, NetworkChanged, NetworkNotFound
}

export interface TerminalRecord {
    stdin: string,
    stdout: string,
    isErr: boolean,
    isUser: boolean
}