import { AdbApi } from "./apis/adbApi";
import { ManageApiApi } from "./apis/manageApiApi.svelte";
import { LoggerApi } from "./apis/loggerApi";
import { NetworkApi } from "./apis/networkApi.svelte";
import { PingerApi } from "./apis/pingerApi";
import { SettingsApi } from "./apis/settingsApi.svelte";
import { StateApi } from "./apis/stateApi.svelte";
import { TerminalApi } from "./apis/terminalApi";
import { TransportRendererIPC } from "./transport";
import { FtcDashboardApi } from "./apis/ftcDashboardApi.svelte";

export interface APIs {
    adbApi: AdbApi,
    loggerApi: LoggerApi,
    networkApi: NetworkApi,
    settingsApi: SettingsApi,
    stateApi: StateApi,
    terminalApi: TerminalApi,
    pingerApi: PingerApi,
    manageApiApi: ManageApiApi,
    ftcDashboardApi: FtcDashboardApi
}

export function createApis(): APIs {
    const transport = new TransportRendererIPC(window);
    const loggerApi = new LoggerApi(transport);
    const pingerApi = new PingerApi(transport);
    return {
        adbApi: new AdbApi(transport),
        loggerApi: loggerApi,
        networkApi: new NetworkApi(transport),
        settingsApi: new SettingsApi(transport),
        stateApi: new StateApi(transport),
        terminalApi: new TerminalApi(transport),
        pingerApi: pingerApi,
        manageApiApi: new ManageApiApi(transport, loggerApi),
        ftcDashboardApi: new FtcDashboardApi(transport, loggerApi, pingerApi)
    };
}