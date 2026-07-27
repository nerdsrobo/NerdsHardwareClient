import { BrowserWindow, IpcMain } from "electron";


export abstract class TransportMain {
    public send: (event: string, ...args: any[]) => void;
    public on: (event: string, handler: (...args: any[]) => void) => void;
    public handle: (event: string, handler: (...args: any[]) => Promise<any> | any) => void;

    constructor(send, on, handle) {
        this.send = send;
        this.on = on;
        this.handle = handle
    }
}

export class TransportMainIPC extends TransportMain {
    constructor(browserWindow: BrowserWindow, ipcMain: IpcMain) {
        super(
            (channel, ...args) => {browserWindow.webContents.send(channel, ...args)},
            (channel, listener) => {ipcMain.on(channel, listener)},
            (channel, listener) => {ipcMain.handle(channel, listener)}
        )
    } 
}