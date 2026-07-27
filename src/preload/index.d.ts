// import { ElectronAPI } from '@electron-toolkit/preload'

import type { AdbApi } from "../main/APIs/adbApi";
import type { LoggerApi } from "../main/APIs/loggerApi";
import type { NetworkApi } from "../main/APIs/networkApi";
import type { PingerApi } from "../main/APIs/pingerApi";
import type { StateApi } from "../main/APIs/stateApi";
import type { StorageApi } from "../main/APIs/storageApi";
import type { TermialApi } from "../main/APIs/terminalApi";

declare global {
  interface Window {
    transport: {
      send: (...args) => void, on: (...args) => void, invoke: (...args) => Promise<any>
    }
  }
}
