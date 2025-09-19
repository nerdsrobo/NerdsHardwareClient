import settings from "electron-settings";

import type SettingsType from "../preload/index";

const settingsKeys = ["autodetect", "autodetect_rc", "autodetect_ch", "autodetect_dash", "display_dash", "adb_autoconnect"]

let logger: Function = _data => {};

export let settingsExport: SettingsType = {
        autodetect: {enabled: true},
        autodetect_rc: {enabled: true},
        autodetect_ch: {enabled: true},
        autodetect_dash: {enabled: true},
        display_dash: {enabled: true},
        adb_autoconnect: {enabled: false}
}

export function setLogger(logger_: Function) {
    logger = logger_;
}

export function updateSetting(key: string, newval: any) {
    settingsExport[key] = newval;
    settings.set(key, newval);
    logger("storage : " + key + " updated in storage to " + JSON.stringify(newval));
}

export function firstLoad(): object {
    const settings_: SettingsType = <SettingsType><unknown>settings.getSync();
    settingsExport = settings_;
    logger("storage : First loaded " + JSON.stringify(settings_));
    settingsKeys.forEach((key) => {
        if ( !Object.keys(settings_).includes(key) ) {
            updateSetting(key, {enabled: key != "adb_autoconnect" ? true : false});
            settings_[key] = {enabled: key != "adb_autoconnect" ? true : false};
        }
    })
    return settings_;
}