import { defaultSettings, Settings } from "../../common/types";
import { eventBus, Store } from "../eventStoreBus";
import { TransportMain } from "../transport";
import { Service } from "./service";
import settings from "electron-settings";

export class SettingsService extends Service {

    public settingsStore: Store<Settings>

    constructor(transport: TransportMain) {
        super(transport, "settings");

        this.settingsStore = new Store(<Settings><unknown>settings.getSync());
        eventBus.verbose("settings loaded: " + JSON.stringify(this.settingsStore.state))

        Object.keys(defaultSettings).forEach(key => {
            if ( !Object.keys(this.settingsStore.state).includes(key) ) {
                this.updateSetting(key, defaultSettings[key]);
                return;
            }
            if ( typeof this.settingsStore.state[key] != typeof defaultSettings[key] ) {
                this.updateSetting(key, defaultSettings[key]);
            }
        })

        this.settingsStore.sub((settings) => {this.sendMessage("settingsUpdated", settings)});

        this.listenToMessage("updateSetting", (key: string, val: any) => this.updateSetting(key, val));

        this.regEvent("getSettings", (_e) => {return this.settingsStore.state});
    }
 
    updateSetting(key: string, val: any) {
        eventBus.verbose("setting updated: " + key + " - " + val);
        this.settingsStore.state[key] = val;
        if ( key == "autodetect" ) { this.settingsStore.state.autodetect_ch = false; this.settingsStore.state.autodetect_dash = false}
        else if ( key == "autodetect_ch" || key == "autodetect_dash" ) { this.settingsStore.state.autodetect = true; }
        this.settingsStore.set(this.settingsStore.state);
        settings.set(this.settingsStore.state);
    }

    tick(): void { }
}