import { contextBridge, ipcRenderer } from 'electron'

export default interface Settings {
  autodetect: {enabled: boolean},
  autodetect_rc: {enabled: boolean},
  autodetect_ch: {enabled: boolean},
  autodetect_dash: {enabled: boolean},
  display_dash: {enabled: boolean},
  adb_autoconnect: {enabled: boolean}
}

const settingsApi = {
  updateSettingsHandler: (callback: (updatedSettings: Settings) => void) => ipcRenderer.on("settings:update", (_e, updatedSettings: Settings) => callback(updatedSettings)),
  firstLoad: () => ipcRenderer.send("settings:firstload"),
  modifySettings: (key: string, newval: object) => ipcRenderer.send("settings:modify", key, newval)
}

const networkApi = {
  updateNetworkHandler: (callback: (ssid: string, found: boolean) => void) => {ipcRenderer.on("network:update", (_e, ssid: string, found: boolean) => callback(ssid, found))}
}

const pingerApi = {
  updatePingerHandler: (callback: (detectionResult: {ch: {success: boolean, disabled: boolean}, dash: {success: boolean, disabled: boolean}}) => void) => ipcRenderer.on("pinger:update", (_e, detectionResult: {ch: {success: boolean, disabled: boolean}, dash: {success: boolean, disabled: boolean}}) => {callback(detectionResult)})
}

const adbApi = {
  // adbConnect: (callback: (isSuccess: boolean) => void) => console.log("132"),//ipcRenderer.send("adb:connect", callback),
  // adbDisconnect: (callback: (isSuccess: boolean) => void) => ipcRenderer.send("adb:disconnect", callback),
  // adbCheckDevice: (callback: (isOnline: boolean) => void) => ipcRenderer.send("adb")
  adbConnect: () => ipcRenderer.send("adb:connect"),
  adbConnectResultHandler: (callback: (isSuccess: boolean) => void) => {ipcRenderer.on("adb:connect:result", (_e, isSuccess: boolean) => callback(isSuccess))},
  adbDisconnect: () => ipcRenderer.send("adb:disconnect"),
  adbDisconnectResultHandler: (callback: (isSuccess: boolean) => void) => {ipcRenderer.on("adb:disconnect:result", (_e, isSuccess: boolean) => callback(isSuccess))}
}

const statusApi = {
  statusUpdatedHandler: (callback) => {ipcRenderer.on("status:update", (_e, status: string) => {callback(status)})}
}

const terminalApi = {
  load: () => {ipcRenderer.send("terminalApi:load")},
  loadHandler: (callback) => {ipcRenderer.on("terminalApi:before", (_e, terminalRecords) => {callback(terminalRecords)})},
  recordsUpdateHandler: (callback) => {ipcRenderer.on("terminalApi:update", (_e, terminalRecord) => {callback(terminalRecord)})},
  exec: (stdin: string) => {ipcRenderer.send("terminalApi:exec", stdin)}
}

const logsConnectorApi = {
  load: () => {ipcRenderer.send("logs:load")},
  loadHandler: (callback) => {ipcRenderer.on("logs:before", (_e, logsRecords: Array<string>) => {callback(logsRecords)})},
  recordsUpdateHandler: (callback) => {ipcRenderer.on("logs:update", (_e, log: string) => {callback(log)})}
}

contextBridge.exposeInMainWorld("settingsApi", settingsApi);
contextBridge.exposeInMainWorld("networkApi", networkApi);
contextBridge.exposeInMainWorld("pingerApi", pingerApi);
contextBridge.exposeInMainWorld("adbApi", adbApi);
contextBridge.exposeInMainWorld("statusApi", statusApi);
contextBridge.exposeInMainWorld("terminalApi", terminalApi);
contextBridge.exposeInMainWorld("logsConnectorApi", logsConnectorApi);