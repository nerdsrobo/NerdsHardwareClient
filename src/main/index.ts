import { app, shell, BrowserWindow, ipcMain, Notification } from 'electron'
import { join } from 'path'
import { electronApp, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { logger, loggerInit, logsRecords, setCallbackUpdate } from './logger'
import { firstLoad, setLogger, settingsExport, updateSetting } from './settingsStorage'
import { setupNetworkUpdater } from './network'
import { makePingOutOfTurn, setupPingerUpdater } from './pinger'
import { existsSync } from 'fs'
import { connect, disconnect, makeTryAutoconnectOutOfTurn, setupAdbConnector } from './adbConnector'
import { isNewNetwork, setupStatusApi, updateStatus } from './statusApi'
import { executeCommand, makeRecord, setupTerminalApi, TerminalRecord, terminalRecords } from './terminalApi'

let firstLoaded = {};

let browserWindow: BrowserWindow;

let lastNetwork: {ssid: string, found: boolean} = {ssid: '', found: false};
let detectResult: {ch: {success: boolean, disabled: boolean, ssid: string}, dash: {success: boolean, disabled: boolean, ssid: string}} = {ch: {success: false, disabled: true, ssid: ''}, dash: {success: false, disabled: true, ssid: ''}};

const isEmulator = existsSync("./logs/emulator.json");

function ipcSend(channel: string, ...args: any[]) {
  browserWindow.webContents.send(channel, ...args);
}


function createWindow(): void {
  loggerInit();

  setLogger(logger);
  firstLoaded = firstLoad();

  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 960,
    height: 560,
    minWidth: 880,
    minHeight: 375,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    },
    title: "Nerds Hardware Client",
    titleBarOverlay: true
  })

  browserWindow = mainWindow;
  ipcMain.on("settings:firstload", (_e) => {ipcSend("settings:update", firstLoaded)});
  ipcMain.on("settings:modify", (_e, key, newval) => updateSetting(key, newval));

  // logger("network " + getNetworkName(process.platform));
  // netnetnet((name) => {console.log(name)})
  setupStatusApi((status: string) => {ipcSend("status:update", status)}, logger);
  setupNetworkUpdater(process.platform, (ssid: string, found: boolean) => { 
    if ( !found ) { updateStatus("Network not found"); }
    if ( lastNetwork.ssid != ssid && found ) { logger("! : network : Network changed to: " + ssid); lastNetwork = {ssid: ssid, found: found}; updateStatus("Network changed"); makePingOutOfTurn(); makeTryAutoconnectOutOfTurn(); }
    lastNetwork = {ssid: ssid, found: found};
    ipcSend("network:update", ssid, found)
  }, logger, isEmulator);
  setupPingerUpdater(() => {return settingsExport}, () => {return lastNetwork}, (type_: string, success: boolean, disabled: boolean) => {
    detectResult[type_] = {success: success, disabled: disabled, ssid: lastNetwork.ssid};
    if ( type_ == "ch" ) {
      if ( success && isNewNetwork ) { updateStatus("Device detected") }
      if ( disabled && isNewNetwork ) { updateStatus("Auto-detection disabled") }
      if ( !success && !disabled && isNewNetwork ) { updateStatus("Idle") }
    }
    ipcSend("pinger:update", detectResult)
  }, logger, isEmulator);
  setupAdbConnector(() => {updateStatus("Connecting")}, () => { if ( !browserWindow.isFocused() ) { new Notification({title: "Connected ADB", silent: true}).show() } updateStatus("Connected")}, () => {updateStatus("Failed")}, () => {return settingsExport.adb_autoconnect.enabled}, () => {return isNewNetwork}, () => {return detectResult.ch}, () => {return lastNetwork.ssid}, makeRecord, logger, isEmulator);
  setupTerminalApi((terminalRecord: TerminalRecord) => {ipcSend("terminalApi:update", terminalRecord)}, logger);

  ipcMain.on("terminalApi:exec", (_e, stdin: string) => {executeCommand(stdin)})
  ipcMain.on("terminalApi:load", (_e) => {ipcSend("terminalApi:before", terminalRecords)})

  setCallbackUpdate((log: string) => {ipcSend("logs:update", log)});
  ipcMain.on("logs:load", (_e) => {ipcSend("logs:before", logsRecords)})

  ipcMain.on("adb:connect", (_e) => {updateStatus("Connecting"); connect((isSuccess: boolean) => {
    if ( isSuccess ) { updateStatus("Connected") }
    else { updateStatus("Failed") }
    ipcSend("adb:connect:result", isSuccess)
  })})
  ipcMain.on("adb:disconnect", (_e) => {disconnect((isSuccess: boolean) => {
    if ( isSuccess ) { updateStatus("Disconnected") }
    else { updateStatus("Failed") }
    ipcSend("adb:disconnect:result", isSuccess)
  })})

  

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')
  

  // let ch = exec("adb disconnect 192.168.43.1:5555");
  // ch.stdout?.on("data", m => console.log(m))
  // ch.stderr?.on("data", m => console.log("err " + m))
  // ch.on("close", (m, s) => {console.log(m)})
  

  

  logger("App ready1");
  logger("App ready2");
  logger("App ready3");
  logger("App ready4");

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
