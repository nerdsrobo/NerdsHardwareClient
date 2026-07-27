import type { TransportRenderer } from "../transport";
import { Api } from "./api";
import type { Settings } from "../../../common/types";

export class SettingsApi extends Api {

    settings: Settings = $state({
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
    })

    constructor(transport: TransportRenderer) {
        super(transport, "settings");

        this.useEvent("getSettings").then((settings) => {this.settings = settings;});

        this.listenToMessage("settingsUpdated", (settings) => {this.settings = settings});
    }

    updateSetting(key: string, val: any) {
        this.sendMessage("updateSetting", key, val);
    }
    
}