import { BrowserWindow, Notification } from "electron";
import { eventBus } from "../eventStoreBus";
import { TransportMain } from "../transport";
import { Service } from "./service";


export class NotificationService extends Service {


    constructor(transport: TransportMain, browserWindow: BrowserWindow) {
        super(transport, "notification");

        eventBus.sub("notification:adbConnected", () => {
            eventBus.verbose("notification - adb connected recieved");
            if ( !browserWindow.isFocused() ) {
                new Notification({title: "Connected ADB", silent: true}).show();
            }
        })
    }

    public tick() {}
}