// import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    settingsApi: {
      updateSettingsHandler: Function,
      firstLoad: Function,
      modifySettings: Function
    }
  }
}
