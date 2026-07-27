import { Executor } from "../execShell";
import { TransportMain } from "../transport";
import { Service } from "./service";
import { eventBus, Store } from "../eventStoreBus";
import { ConnectionState, NetworkInfo, PingerInfo, Settings } from "../../common/types";
import { platform } from "process";

enum DeviceAdbStatus {
    NotConnected, Offline, Online
}

export class AdbService extends Service {

    executor: Executor;

    settings: Settings;
    pingerInfo: PingerInfo;
    networkInfo: NetworkInfo;

    connectionStateStore: Store<ConnectionState>;

    autoconnectEnabled: boolean;
    triedAutoconnect: boolean;

    constructor(transport: TransportMain, executor: Executor, settingsStore: Store<Settings>, pingerStore: Store<PingerInfo>, networkStore: Store<NetworkInfo>) {
        super(transport, "adb");

        this.executor = executor;
        
        this.listenToMessage("connect", () => this.startConnect());
        this.listenToMessage("disconnect", () => this.startDisconnect());

        this.connectionStateStore = new Store<ConnectionState>(ConnectionState.Disconnected);

        this.autoconnectEnabled = false;
        this.triedAutoconnect = false;

        eventBus.sub("adb:networkUpdated", () => {this.triedAutoconnect = false; eventBus.verbose("network updated, adb tried autoconnect reseted")});

        this.settings = settingsStore.sub((settings => {this.settings = settings; this.updateAutoconnectEnabled()}));
        this.pingerInfo = pingerStore.sub((pingerInfo => {this.pingerInfo = pingerInfo; this.updateAutoconnectEnabled()}));
        this.networkInfo = networkStore.sub((networkInfo => {this.networkInfo = networkInfo; this.updateAutoconnectEnabled()}));
    }

    emitNotification() {
        eventBus.emit("notification:adbConnected");
    }

    startConnect() {
        eventBus.verbose("adb connection started");
        this.connectionStateStore.set(ConnectionState.Connecting);
        this.checkDeviceOnline(isDeviceOnline => {
            if ( isDeviceOnline == DeviceAdbStatus.Online ) {
                eventBus.verbose("device already connected");
                this.connectionStateStore.set(ConnectionState.Connected);
                this.emitNotification();
                return;
            }
            if ( isDeviceOnline == DeviceAdbStatus.NotConnected ) {
                this.executor.platformRelativeAdbExecute("adb connect 192.168.43.1:5555", (_err, stdout, stderr) => {
                    eventBus.verbose("adb connect result - stdout: " + stdout + " stderr: " + stderr);
                    if ( stderr ) { eventBus.log("seems adb connect failed - stdout: " + stdout + " stderr: " + stderr); }
                    eventBus.emit("terminal:addRecord", {
                        stdin: (platform != "win32" ? "./" : "") + "adb connect 192.168.43.1:5555",
                        stdout: stdout,
                        isErr: stderr ? true : false,
                        isUser: false
                    });
                    this.checkDeviceOnline(isDeviceOnline => {
                        this.connectionStateStore.set(isDeviceOnline == DeviceAdbStatus.Online ? ConnectionState.Connected : ConnectionState.ConnectionError);
                        eventBus.verbose("connection result: " + this.connectionStateStore.state);
                        if ( isDeviceOnline == DeviceAdbStatus.Online ) { this.emitNotification() }
                    });
                })
            }
            else if ( isDeviceOnline == DeviceAdbStatus.Offline ) {
                this.executor.platformRelativeAdbExecute("adb disconnect 192.168.43.1:5555", (_err, stdout, stderr) => {
                    eventBus.verbose("adb disconnect while connecting and device is offline result - stdout: " + stdout + " stderr: " + stderr);
                    eventBus.emit("terminal:addRecord", {
                        stdin: (platform != "win32" ? "./" : "") + "adb disconnect 192.168.43.1:5555",
                        stdout: stdout,
                        isErr: stderr ? true : false,
                        isUser: false
                    });
                    this.executor.platformRelativeAdbExecute("adb connect 192.168.43.1:5555", (_err, stdout, stderr) => {
                        eventBus.verbose("adb connect while connecting and device is offline result - stdout: " + stdout + " stderr: " + stderr);
                        eventBus.emit("terminal:addRecord", {
                            stdin: (platform != "win32" ? "./" : "") + "adb connect 192.168.43.1:5555",
                            stdout: stdout,
                            isErr: stderr ? true : false,
                            isUser: false
                        });
                        this.checkDeviceOnline(isDeviceOnline => {
                            if ( isDeviceOnline == DeviceAdbStatus.Online ) {
                                this.connectionStateStore.set(ConnectionState.Connected);
                                eventBus.verbose("connection success after device was offline");
                                this.emitNotification();
                                return;
                            }
                            eventBus.log("adb connection failed on 1 attempt");
                            this.executor.platformRelativeAdbExecute("adb disconnect 192.168.43.1:5555", (_err, stdout, stderr) => {
                                eventBus.verbose("adb disconnect on 1 attempt - stdout: " + stdout + " stderr: " + stderr);
                                eventBus.emit("terminal:addRecord", {
                                    stdin: (platform != "win32" ? "./" : "") + "adb disconnect 192.168.43.1:5555",
                                    stdout: stdout,
                                    isErr: stderr ? true : false,
                                    isUser: false
                                });
                                setTimeout(() => {this.connectionTry(2)}, 10000);
                            })
                        })
                    })
                })
            }
        })   
    }

    connectionTry(attempt: number) {
        this.executor.platformRelativeAdbExecute("adb connect 192.168.43.1:5555", (_err, stdout, stderr) => {
            eventBus.verbose("adb connect on " + attempt + " attempt - stdout: " + stdout + " stderr: " + stderr);
            if ( stderr ) { eventBus.log("seems adb connect failed - stdout: " + stdout + " stderr: " + stderr); }
            eventBus.emit("terminal:addRecord", {
                stdin: (platform != "win32" ? "./" : "") + "adb connect 192.168.43.1:5555",
                stdout: stdout,
                isErr: stderr ? true : false,
                isUser: false
            });
            this.checkDeviceOnline(isDeviceOnline => {
                if ( isDeviceOnline == DeviceAdbStatus.Online ) {
                    this.connectionStateStore.set(ConnectionState.Connected);
                    eventBus.verbose("connection success after device was offline on " + attempt + "attempt");
                    this.emitNotification();
                    return;
                }
                if ( attempt > 12 ) {
                    this.connectionStateStore.set(ConnectionState.ConnectionError);
                    eventBus.verbose("connection tryies stopped after " + attempt + " attempts");
                    return;
                }
                eventBus.log("adb connection failed on " + attempt + " attempt");
                this.executor.platformRelativeAdbExecute("adb disconnect 192.168.43.1:5555", (_err, stdout, stderr) => {
                    eventBus.verbose("adb disconnect on " + attempt + " attempt - stdout: " + stdout + " stderr: " + stderr);
                    eventBus.emit("terminal:addRecord", {
                        stdin: (platform != "win32" ? "./" : "") + "adb disconnect 192.168.43.1:5555",
                        stdout: stdout,
                        isErr: stderr ? true : false,
                        isUser: false
                    });
                    setTimeout(() => {this.connectionTry(attempt + 1)}, 7000);
                });
            })
        })
    }

    startDisconnect() {
        eventBus.verbose("adb disconnection started");
        this.connectionStateStore.set(ConnectionState.Connecting);
        this.executor.platformRelativeAdbExecute("adb disconnect 192.168.43.1:5555", (_err, stdout, stderr) => {
            eventBus.verbose("adb discconnect result - stdout: " + stdout + " stderr: " + stderr);
            if ( stderr ) { eventBus.log("seems adb disconnect failed - stdout: " + stdout + " stderr: " + stderr); }
            eventBus.emit("network:adbDisconnected")
            eventBus.emit("terminal:addRecord", {
                stdin: (platform != "win32" ? "./" : "") + "adb disconnect 192.168.43.1:5555",
                stdout: stdout,
                isErr: stderr ? true : false,
                isUser: false
            });
            this.checkDeviceOnline(isDeviceOnline => {
                this.connectionStateStore.set(isDeviceOnline == DeviceAdbStatus.NotConnected || isDeviceOnline == DeviceAdbStatus.Offline ? ConnectionState.Disconnected : ConnectionState.DisconnectionError);
                eventBus.verbose("adb disconnection state: " + this.connectionStateStore.state);
            })
        })
    }

    checkDeviceOnline(callback: (isDeviceOnline: DeviceAdbStatus) => void) {
        this.executor.platformRelativeAdbExecute("adb devices", (_err, stdout, _stderr) => {
            let isDeviceOnline = DeviceAdbStatus.NotConnected;
            stdout.split(platform != "win32" ? '\n' : '\r\n').forEach(line => {
                if ( line.split('\t')[0] == "192.168.43.1:5555" ) {
                    if ( line.split('\t')[1] == "device" ) { isDeviceOnline = DeviceAdbStatus.Online; }
                    else { isDeviceOnline = DeviceAdbStatus.Offline; }
                }
            });
            // eventBus.verbose("adb devices result - stdout: " + stdout + " stderr: " + _stderr + " isDeviceOnline: " + isDeviceOnline);
            callback(isDeviceOnline);
        })
    }

    tickCheckDeviceOnline() {
        this.checkDeviceOnline(isDeviceOnline => {
            if ( (isDeviceOnline == DeviceAdbStatus.NotConnected || isDeviceOnline == DeviceAdbStatus.Offline) && ( this.connectionStateStore.state == ConnectionState.Connected || this.connectionStateStore.state == ConnectionState.DisconnectionError )) {
                eventBus.log("uncontrolled device disconnection");
                this.connectionStateStore.set(ConnectionState.Disconnected);
            }
            else if ( isDeviceOnline == DeviceAdbStatus.Online && ( this.connectionStateStore.state == ConnectionState.Disconnected || this.connectionStateStore.state == ConnectionState.ConnectionError )) {
                eventBus.log("uncontrolled device connection");
                this.connectionStateStore.set(ConnectionState.Connected);
            }
        })
    }

    updateAutoconnectEnabled() {
        this.autoconnectEnabled = this.settings.adb_autoconnect &&
                                  !this.triedAutoconnect &&
                                  this.pingerInfo.ch.found &&
                                  this.pingerInfo.ch.ssid == this.networkInfo.ssid;
    }

    tick() {
        if ( this.autoconnectEnabled ) { this.startConnect(); this.triedAutoconnect = true; }
        this.tickCheckDeviceOnline();
    }
    
}