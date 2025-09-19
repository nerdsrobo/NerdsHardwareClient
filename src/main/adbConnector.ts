import { exec } from "child_process";
import { readFileSync } from "fs";
import { TerminalRecord } from "./terminalApi";


let logger: (data: string) => void = (_data: string) => {};
let isEmulator = false;

let getIsAutoconnectEnabled: () => boolean = () => {return false}
let getIsNewNetwork: () => boolean = () => {return false}
let getDeviceInfo: () => {success: boolean, disabled: boolean, ssid: string} = () => {return {success: false, disabled: true, ssid: ''}}
let getNetworkSsid: () => string = () => {return ''}
let callbackStatusConnecting: () => void = () => {}
let callbackStatusConnected: () => void = () => {}
let callbackStatusFailed: () => void = () => {}

let makeTerminalRecord: (terminalRecord: TerminalRecord) => void = (_terminalRecord: TerminalRecord) => {}

export function connect(callback: (isSuccess: boolean) => void) {
    if ( isEmulator ) {
        const emulator = JSON.parse(readFileSync("./logs/emulator.json").toString());
        callback(emulator.connect_isSuccess);
        logger("adbConnector : Emulated connection result: " + emulator.connect_isSuccess);
        makeTerminalRecord({stdin: "(emulator) adb connect 192.168.43.1:5555", stdout: "(emulator) isSuccess: " + emulator.connect_isSuccess, isErr: !emulator.connect_isSuccess, isUser: false})
        return
    }
    const cmd = "adb connect 192.168.43.1:5555"
    exec("adb connect 192.168.43.1:5555", (stderr, stdout) => {
        makeTerminalRecord({stdin: cmd, stdout: stdout, isErr: stderr?.message ? true : false, isUser: false})
        console.log(stdout);
        console.log(stderr?.message);
        if ( stderr?.message ) { console.log("tomat")}
        callback(stdout.split(' ')[0].trim() == "connected"); // так называемый парсинг
    })
}

export function disconnect(callback: (isSuccess: boolean) => void) {
    if ( isEmulator ) {
        const emulator = JSON.parse(readFileSync("./logs/emulator.json").toString());
        callback(emulator.disconnect_isSuccess);
        logger("adbConnector : Emulated disconnection result: " + emulator.disconnect_isSuccess);
        makeTerminalRecord({stdin: "(emulator) adb disconnect 192.168.43.1:5555", stdout: "(emulator) isSuccess: " + emulator.disconnect_isSuccess, isErr: !emulator.disconnect_isSuccess, isUser: false})
        return
    }
    const cmd = "adb disconnect 192.168.43.1:5555"
    exec("adb disconnect 192.168.43.1:5555", (stderr, stdout) => {
        makeTerminalRecord({stdin: cmd, stdout: stdout, isErr: stderr?.message ? true : false, isUser: false})
        console.log(stdout);
        console.log(stderr?.message);
        if ( stderr?.message ) { console.log("tomat")}
        callback(stdout.split(' ')[0].trim() == "disconnected")
    })
}

export function checkDevice(callback: (isOnline: boolean) => void) {
    if ( isEmulator ) {
        const emulator = JSON.parse(readFileSync("./logs/emulator.json").toString());
        callback(emulator.checkDevice_isOnline);
        logger("adbConnector : Emulated check device result: " + emulator.checkDevice_isOnline);
        makeTerminalRecord({stdin: "(emulator) adb devices", stdout: "(emulator) isOnline: " + emulator.checkDevice_isOnline, isErr: false, isUser: false})
        return
    }
    const cmd = "adb devices"
    exec("adb devices", (stderr, stdout) => {
        makeTerminalRecord({stdin: cmd, stdout: stdout, isErr: stderr?.message ? true : false, isUser: false})
        if ( stderr?.message ) {
            callback(false);
            return;
        }
        let answer = false;
        stdout.split("\r\n").slice(1, -2).forEach(line => {
            if ( answer ) { return; }
            const ipAndStatus = line.split("   ");
            if ( ipAndStatus.length < 2 ) { return; }
            if ( ipAndStatus[0] == "192.168.43.1:5555" ) {
                answer = true;
                if ( ipAndStatus[1] == "online" ) { callback(true); }
                else { callback(false); }
            }
        })
        if ( !answer ) { callback(false); }
        // console.log(stdout.split("\r\n").slice(1, -2));
        // console.log(stderr?.message);
        // if ( stderr?.message ) { console.log("tomat")}

    })
}

function makeTryAutoconnect() {
    if ( getIsAutoconnectEnabled() && getIsNewNetwork() && getDeviceInfo().success && getDeviceInfo().ssid == getNetworkSsid() ) {
        logger("adbConnector : Allowed to auto connect")
        callbackStatusConnecting()
        connect((isSuccess: boolean) => {isSuccess ? callbackStatusConnected() : callbackStatusFailed()})
    }
}

function idleUpdate() {
    makeTryAutoconnect();
    setTimeout(idleUpdate, 3000)
}

export function makeTryAutoconnectOutOfTurn() {
    makeTryAutoconnect();
}

export function setupAdbConnector(callbackStatusConnecting_: () => void, callbackStatusConnected_: () => void, callbackStatusFailed_: () => void, getIsAutoconnectEnabled_: () => boolean, getIsNewNetwork_: () => boolean, getDeviceInfo_: () => {success: boolean, disabled: boolean, ssid: string}, getNetworkSsid_: () => string, makeTerminalRecord_: (terminalRecord: TerminalRecord) => void, logger_: (data: string) => void, isEmulator_: boolean) {
    logger = logger_;
    isEmulator = isEmulator_;
    getIsAutoconnectEnabled = getIsAutoconnectEnabled_;
    getIsNewNetwork = getIsNewNetwork_;
    getDeviceInfo = getDeviceInfo_;
    getNetworkSsid = getNetworkSsid_;
    callbackStatusConnecting = callbackStatusConnecting_;
    callbackStatusConnected = callbackStatusConnected_;
    callbackStatusFailed = callbackStatusFailed_;
    makeTerminalRecord = makeTerminalRecord_;
    idleUpdate()
}