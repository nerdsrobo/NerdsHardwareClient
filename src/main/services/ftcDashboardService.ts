import { clearGamepad, GamepadsState, Message, MessageRecieveOpModeList, MessageRecieveRobotStatus, OpModeStatus, RobotStatus } from "../../common/dashboardTypes";
import { PingerInfo, Settings } from "../../common/types";
import { eventBus, Store } from "../eventStoreBus";
import { TransportMain } from "../transport";
import { Service } from "./service";
import { WebSocket } from "ws";


export class FtcDashboardService extends Service {

    settings: Settings;
    pingerInfo: PingerInfo;

    wsc?: WebSocket;
    connectTimeout?: NodeJS.Timeout;

    pingRobotStatusPending = false;
    pingRobotStatusTs = 0;

    opModeListStore: Store<Array<string>>;
    robotStatusStore: Store<RobotStatus>;

    isConnect = false;

    isOpened: Store<boolean>;
    isCommandReady: Store<boolean>;

    clearGamepadsSent = false;

    constructor(transport: TransportMain, settingsStore: Store<Settings>, pingerStore: Store<PingerInfo>) {
        super(transport, "ftcDashboard");

        this.opModeListStore = this.createAndSyncStore<Array<string>>("opModeList", []);
        this.robotStatusStore = this.createAndSyncStore<RobotStatus>("robotStatus" ,{
            activeOpMode: "$Stop$Robot$", activeOpModeStatus: OpModeStatus.STOPPED, warningMessage: '', errorMessage: '', batteryVoltage: 0, pingMs: 0
        });
        this.isOpened = this.createAndSyncStore<boolean>("isOpened", false);
        this.isCommandReady = this.createAndSyncStore<boolean>("isCommandReady", false);

        this.listenToMessage("gamepads123", (gamepads) => {this.sendGamepads(gamepads)});
        this.listenToMessage("gamepadsDisconnected", () => {if ( this.clearGamepadsSent ) {return}; this.clearGamepadsSent = true; this.sendGamepads({
            gamepad1: clearGamepad,
            gamepad2: clearGamepad
        })});
        this.listenToMessage("initOpMode", (index) => this.initOpMode(this.opModeListStore.state[index]));
        this.listenToMessage("startOpMode", () => this.startOpMode());
        this.listenToMessage("stopOpMode", () => this.stopOpMode());

        this.settings = settingsStore.sub((settings => {this.settings = settings; this.updateIsReconnect()}));
        this.pingerInfo = pingerStore.sub((pingerInfo => {this.pingerInfo = pingerInfo; this.updateIsReconnect()}));
    }

    connect() {
        if ( this.isConnect && !this.wsc ) {
            this.wsc = new WebSocket("ws://192.168.43.1:8000", {perMessageDeflate: false})

            this.wsc.onopen = (_ev) => {
                this.isOpened.set(true);
                eventBus.log("FTC Dashboard ws connected");
            }
            this.wsc.onclose = (ev) => {
                this.isOpened.set(false);
                this.isCommandReady.set(false);
                eventBus.log(`FTC Dashboard ws closed - ${ev.code} ${ev.reason}`);
                this.wsc = undefined;
                this.isConnect = false;
                this.pingRobotStatusPending = false;
            }
            this.wsc.onerror = (ev) => {
                eventBus.log(`FTC Dasboard ws error: ${ev}`);
                this.isConnect = false;
            }
            this.wsc.onmessage = event => this.messageHandler(event);
        }
    }

    messageHandler(event: MessageEvent<any>) {
        if ( event.data == "pong" ) { return; }
        const msgOnlyType: Message = JSON.parse(event.data);
        eventBus.verbose(`ftc dashboard ws received message type: ${msgOnlyType.type}`)
        switch(msgOnlyType.type) {
            case "RECEIVE_OP_MODE_LIST":
                const msgROML: MessageRecieveOpModeList = JSON.parse(event.data);
                this.opModeListStore.set(msgROML.opModeList);
                eventBus.verbose(`opModeListUpdated, list length: ${msgROML.opModeList.length}`);
                break;
            case "RECEIVE_ROBOT_STATUS":
                const msgRRRS: MessageRecieveRobotStatus = JSON.parse(event.data);
                const opModeStatusEnum: OpModeStatus = OpModeStatus[msgRRRS.status.activeOpModeStatus as unknown as keyof typeof OpModeStatus];
                msgRRRS.status.activeOpModeStatus = msgRRRS.status.activeOpMode == "$Stop$Robot$" ? OpModeStatus.STOPPED : opModeStatusEnum;
                this.robotStatusStore.set({
                    activeOpMode: msgRRRS.status.activeOpMode,
                    activeOpModeStatus: msgRRRS.status.activeOpModeStatus,
                    warningMessage: msgRRRS.status.warningMessage,
                    errorMessage: msgRRRS.status.errorMessage,
                    batteryVoltage: msgRRRS.status.batteryVoltage,
                    pingMs: this.pingRobotStatusPending ? Date.now() - this.pingRobotStatusTs : -1
                });
                this.pingRobotStatusTs = Date.now();
                this.pingRobotStatusPending = false;
                this.isCommandReady.set(true);
                eventBus.verbose(`robotStatusUpdated, activeOpMode: ${msgRRRS.status.activeOpMode}, status: ${msgRRRS.status.activeOpModeStatus}, battery: ${msgRRRS.status.batteryVoltage}, ts: ${this.pingRobotStatusTs}`);
                break;
        }
    }

    getRobotStatus() {
        if ( this.wsc && this.isOpened.state ) {
            this.wsc.send(JSON.stringify({
                type: "GET_ROBOT_STATUS"
            }));
            this.pingRobotStatusPending = true;
            this.pingRobotStatusTs = Date.now();
            eventBus.verbose(`pings robot status, ts: ${this.pingRobotStatusTs}`);
        }
    }

    sendGamepads(gamepadsState: GamepadsState) {
        this.clearGamepadsSent = false;
        if ( this.wsc && this.isOpened.state && !(this.robotStatusStore.state.activeOpMode == "$Stop$Robot$") ) {
            this.wsc.send(JSON.stringify({
                type: "RECEIVE_GAMEPAD_STATE",
                gamepad1: gamepadsState.gamepad1,
                gamepad2: gamepadsState.gamepad2
            }))
        }
    }

    initOpMode(opModeName: string) {
        if ( this.wsc && this.isOpened.state ) {
            this.wsc.send(JSON.stringify({
                "type": "INIT_OP_MODE",
                "opModeName": opModeName
            }))
            eventBus.verbose(`opModeInit sent: ${opModeName}`);
        }
    }
    startOpMode() {
        if ( this.wsc && this.isOpened.state ) {
            this.wsc.send(JSON.stringify({
                type: "START_OP_MODE"
            }))
            eventBus.verbose(`opModeStart sent`);
        }
    }
    stopOpMode() {
        if ( this.wsc && this.isOpened.state ) {
            this.wsc.send(JSON.stringify({
                type: "STOP_OP_MODE"
            }))
            eventBus.verbose(`opModeStop sent`);
        }
    }

    updateIsReconnect() {
        if ( (!this.pingerInfo.dash.found || !this.settings.use_dashboard_on_main_page) && this.isConnect ) {
            this.isConnect = false;
            this.wsc?.close();
            clearTimeout(this.connectTimeout);
        }
        else if (this.pingerInfo.dash.found && this.settings.use_dashboard_on_main_page && !this.isConnect)  {
            this.isConnect = true;
            if ( !this.wsc ) {
                this.connectTimeout = setTimeout(() => this.connect(), 3000);
            }
        }
    }

    public tick() {
        if ( this.isOpened.state && this.pingRobotStatusPending &&  Date.now() - this.pingRobotStatusTs > 3367 ) {
            eventBus.log("FTC Dashboard ws don't answer, terminating")
            this.isOpened.set(false);
            this.isCommandReady.set(false);
            this.wsc?.terminate();
        }
        if ( this.isOpened.state && !this.pingRobotStatusPending && Date.now() - this.pingRobotStatusTs > 267 ) {
            this.getRobotStatus()
        }
    }

}