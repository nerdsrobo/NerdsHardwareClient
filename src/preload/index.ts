import { contextBridge, ipcRenderer } from "electron";


contextBridge.exposeInMainWorld("transport", {
    send: ipcRenderer.send, on: (channel, listener) => ipcRenderer.on(channel, listener), invoke: ipcRenderer.invoke
})