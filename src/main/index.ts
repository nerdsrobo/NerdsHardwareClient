import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join, resolve } from 'path'
import { electronApp, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { execSync } from 'child_process'
import { Service } from './services/service'
import { TransportMainIPC } from './transport'
import { LoggerService } from './services/loggerService'
import { TerminalService } from './services/terminalService'
import { SettingsService } from './services/settingsService'
import { NetworkService } from './services/networkService'
import { PingerService } from './services/pingerService'
import { AdbService } from './services/adbService'
import { StateService } from './services/stateService'
import { Executor } from './execShell'
import { NotificationService } from './services/notificationService'
import { ManageApiService } from './services/manageApiService'
import { FtcDashboardService } from './services/ftcDashboardService'

let browserWindow: BrowserWindow;
let mainWindow;

// function ipcSend(channel: string, ...args: any[]) {
//   try {
//     browserWindow.webContents.send(channel, ...args);
//   }
//   catch (e) {
//     return
//   }
// }

function getPathToExec() {
    if ( process.platform == "darwin" && !is.dev ) { return join(process.resourcesPath, 'adb', 'darwin', 'platform-tools') + '/' }
    return resolve("adb/" + process.platform + "/platform-tools/");
} // пусть пока тут

function createWindow(): void {
  // loggerInit();

  // setLogger(logger);
  // firstLoaded = firstLoad();

  if ( process.platform != "win32" ) {
    //presetAdbConnectorPlatform(process.platform)
    if ( process.platform == "darwin" && !is.dev ) {
      try {execSync('xattr -d com.apple.quarantine ' + getPathToExec() + "/adb" + ' || true'); }
      catch (e) { }//logger("failed to dequrantine on mac, " + e) }
    }
    try { execSync("chmod +x \"" + getPathToExec() + "/adb\"") }
    catch (e) { }//logger("failed to chmod, " + e) }
  }
  

  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 960,
    height: 560,
    minWidth: 880,
    minHeight: 375,
    show: true,
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
  
  const transport = new TransportMainIPC(browserWindow, ipcMain);

  const executor = new Executor();

  const notificationService = new NotificationService(transport, browserWindow);
  const loggerService = new LoggerService(transport);
  const manageApiService = new ManageApiService(transport);
  const terminalService = new TerminalService(transport, executor);
  const settingsService = new SettingsService(transport);
  const networkService = new NetworkService(transport);
  const pingerService = new PingerService(transport, settingsService.settingsStore, networkService.networkStore, networkService.lastNetworkStore);
  const adbService = new AdbService(transport, executor, settingsService.settingsStore, pingerService.pingerStore, networkService.networkStore);
  const ftcDashboardService = new FtcDashboardService(transport, settingsService.settingsStore, pingerService.pingerStore);
  const stateService = new StateService(transport, networkService.networkStore, pingerService.pingerStore, adbService.connectionStateStore, networkService.disconnectedAtThatNetwork);

  const tickServices: Array<Service> = [networkService, pingerService, adbService, ftcDashboardService];

  function tickAll() {
    tickServices.forEach(service => {
      service.tick();
    });
    setTimeout(tickAll, 300);
  }

  tickAll();
  

  // mainWindow.on('ready-to-show', () => {
  //   mainWindow.show()
  // })

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
    // // // mainWindow.loadFile(join(process.resourcesPath, 'app.asar', 'renderer', 'index.html'))
    // // mainWindow.loadURL("https://example.com")
  }

  // mainWindow.webContents.once('did-finish-load', () => {
  //   mainWindow.show()
  // })
  // mainWindow.webContents.on(
  //   'did-fail-load',
  //   (_e, code, desc, url) => {
  //     // logger(`LOAD FAIL ${code}: ${desc} ${url}`)
  //   }
  // )

}


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')
  



  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0 ) createWindow()
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
