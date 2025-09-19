import { exec } from "child_process";
import { readFileSync } from "fs";

let logger = (_data: string) => {}

let isEmulator = false;

function parseWin(callback: (ssid: string, found: boolean) => void) {
    exec("netsh wlan show interfaces", (_err, stdout) => {
        let found = false;
        stdout.split("\r\n").forEach(line => {
            if ( line.split(":")[0].includes(" SSID ") ) {
                found = true;
                logger("network : updated network to " + line.split(":")[1].trim())
                callback(line.split(":")[1].trim(), true)
            }
        })
        if ( !found ) {
            logger("network : updated that network not found")
            callback('', false);
        }
    })
}

function parseLinux(callback: (ssid: string, found: boolean) => void) {
    exec("iwgetid -r", (_err, stdout) => {
        if ( stdout ) {
            logger("network : updated network to " + stdout);
            callback(stdout, true);
        }
        else {
            logger("network : updated that network not found")
            callback('', false);
        }
    })
}

function parseMac(callback: (ssid: string, found: boolean) => void) {
    exec('networksetup -listallhardwareports | awk \'/Wi-Fi/{getline; print $2}\' | xargs networksetup -getairportnetwork | awk -F": " \'{print $2}\'', (err, stdout) => {
    if (err) {
        logger("network : updated that network not found")
        callback('', false);
        return;
    }
    logger("network : updated network to " + stdout.trim())
    callback(stdout.trim(), true);
    })
}

function getNetworkName(platform: string, callback: (ssid: string, found: boolean) => void) {
    if ( isEmulator ) {
        const emulator = JSON.parse(readFileSync("./logs/emulator.json").toString());
        callback(emulator.network_ssid, emulator.network_found);
        return
    }
    if ( platform == "win32" ) {
        parseWin(callback);
    }
    else if ( platform == "linux" ) {
        parseLinux(callback);
    }
    else if ( platform == "darwin" ) {
        parseMac(callback)
    }
    else {
        logger("network : invalid platform, " + platform)
        callback('', false)
    }
}

function idleUpdate(platform: string, callback: (ssid: string, found: boolean) => void) {
    getNetworkName(platform, callback);
    setTimeout(idleUpdate, 3000, platform, callback);
}

export function setupNetworkUpdater(platform: string, callback: (ssid: string, found: boolean) => void, logger_: (_data: string) => void, isEmulator_: boolean) {
    logger = logger_;
    isEmulator = isEmulator_;
    idleUpdate(platform, callback);
}

export function netnetnet(callback) { getNetworkName("win32", callback); }