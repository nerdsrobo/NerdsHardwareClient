import { readFileSync } from "fs";

import type SettingsType from "../preload/index";

let logger = (_data: string) => {};
let isEmulator = false;

let settingsGetter: () => SettingsType = () => {return {autodetect: {enabled: true}, autodetect_rc: {enabled: true}, autodetect_ch: {enabled: true}, autodetect_dash: {enabled: true}, display_dash: {enabled: true}, adb_autoconnect: {enabled: false}}}
let networkGetter: () => {ssid: string, found: boolean} = () => {return {ssid: '', found: false}}
let callback: (type_: string, success: boolean, disabled: boolean) => void = (_type_: string, _success: boolean, _disabled: boolean) => {};

function fetchIsSuccess(url: string, callback: (success: boolean) => void) {
    if ( isEmulator ) {
        const emulator = JSON.parse(readFileSync("./logs/emulator.json").toString());
        if ( url == "http://192.168.43.1:8080" ) { callback(emulator.fetch_success_ch); return; }
        if ( url == "http://192.168.43.1:8080/dash" ) { callback(emulator.fetch_success_dash); return; }
    }
    fetch(url, { signal: AbortSignal.timeout(3000) }).then((_resp) => {callback(true);}, (_reason) => {callback(false)});
}

function makeCallbackDisabled(callback: (type_: string, success: boolean, disabled: boolean) => void) {
    logger("pinger : autodetect is disabled")
    callback("ch", false, true);
    callback("dash", false, true);
}

function makePing() {
    const settings = settingsGetter();
    logger("pinger : ping started")
    if ( settings.autodetect.enabled ) {
        if ( ( settings.autodetect_rc.enabled && networkGetter().ssid.includes("-RC") ) || !settings.autodetect_rc.enabled ) {
            if ( settings.autodetect_ch.enabled ) {
                fetchIsSuccess("http://192.168.43.1:8080", (success: boolean) => {logger("pinger : Control Hub detection result: " + success); callback("ch", success, false)})
            }
            else { logger("pinger : Control Hub detection disabled"); callback("ch", false, true); }
            if ( settings.autodetect_dash.enabled ) {
                fetchIsSuccess("http://192.168.43.1:8080/dash", (success: boolean) => {logger("pinger : Dashboard detection result: " + success); callback("dash", success, false)})
            }
            else { logger("pinger : Dashboard detection disabled"); callback("dash", false, true); }
        }
        else {
            makeCallbackDisabled(callback)
        }
    }
    else {
        makeCallbackDisabled(callback)
    }
}

function idleUpdate() {
    makePing()
    setTimeout(idleUpdate, 4000);
}

export function makePingOutOfTurn() {
    makePing()
}

export function setupPingerUpdater(settingsGetter_: () => SettingsType, networkGetter_: () => {ssid: string, found: boolean}, callback_: (type_: string, success: boolean, disabled: boolean) => void, logger_: (_data: string) => void, isEmulator_: boolean) {
    logger = logger_;
    isEmulator = isEmulator_;
    callback = callback_;
    settingsGetter = settingsGetter_;
    networkGetter = networkGetter_;
    idleUpdate();
}