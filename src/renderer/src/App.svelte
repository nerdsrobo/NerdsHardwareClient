<script lang="ts">

    import Load from "./pages/Load.svelte";
    import Main from "./pages/Main.svelte"
    import Settings from "./pages/Settings.svelte";
    
    import type { TerminalRecord } from "../../main/terminalApi";

    import type SettingsType from "../../preload/index";

    let mainConnectHandler = (_isSuccess: boolean) => {};
    let mainDisconnectHandler = (_isSuccess: boolean) => {};

    const adbApi = {
        connect: (callback: (isSuccess: boolean) => void) => {mainConnectHandler = callback; window.adbApi.adbConnect()},
        disconnect: (callback: (isSuccess: boolean) => void) => {mainDisconnectHandler = callback; window.adbApi.adbDisconnect()}
    }

    let terminalBeforeHandler = (_terminalRecords: Array<TerminalRecord>) => {}
    let terminalRecordUpdateHandler = (_terminalRecord: TerminalRecord) => {}

    const terminalApi = {
        load: (callback: (terminalRecords: Array<TerminalRecord>) => void) => {terminalBeforeHandler = callback; window.terminalApi.load()},
        setRecordUpdateHandler: (callback: (terminalRecord: TerminalRecord) => void) => {terminalRecordUpdateHandler = callback},
        exec: (stdin: string) => {window.terminalApi.exec(stdin)}
    }

    let logsConnectorBeforeHandler = (_logs: Array<string>) => {}
    let logsConnectorRecordUpdateHandler = (_log: string) => {}

    const logsConnectorApi = {
        load: (callback: (logs: Array<string>) => void) => {logsConnectorBeforeHandler = callback, window.logsConnectorApi.load()},
        setRecordUpdateHandler: (callback: (log: string) => void) => {logsConnectorRecordUpdateHandler = callback}
    }

    let currPage = $state("load");

    let settings: SettingsType = $state({
        autodetect: {enabled: true},
        autodetect_rc: {enabled: true},
        autodetect_ch: {enabled: true},
        autodetect_dash: {enabled: true},
        display_dash: {enabled: true},
        adb_autoconnect: {enabled: false}
    })

    let network = $state({ssid: '', found: false});
    let detectionResult = $state({ch: {success: false, disabled: true}, dash: {success: false, disabled: true}});

    function goto(page: string) {
        currPage = page;
    }

    function getIsSettingEnabled(key: string) {
        return settings[key].enabled
    }

    function modifySetting(key: string, newval: boolean) {
        settings[key] = {enabled: newval};
        window.settingsApi.modifySettings(key, {enabled: newval});
    }

    function settingsStorageUpdateHandler(settings_: SettingsType) {
        if ( currPage == "load" ) { currPage = "main" }
        settings = settings_;
    }

    function updateNetwork(ssid: string, found: boolean) {
        network.ssid = ssid;
        network.found = found;
    }

    function updatePinger(detectionResult_) {
        detectionResult = detectionResult_;
    }

    let statusInfo = $state("Started");

    window.settingsApi.updateSettingsHandler(settingsStorageUpdateHandler);
    window.settingsApi.firstLoad();
    window.networkApi.updateNetworkHandler(updateNetwork);
    window.pingerApi.updatePingerHandler(updatePinger);
    window.adbApi.adbConnectResultHandler((isSuccess: boolean) => {mainConnectHandler(isSuccess)});
    window.adbApi.adbDisconnectResultHandler((isSuccess: boolean) => {mainDisconnectHandler(isSuccess)});
    window.statusApi.statusUpdatedHandler((status: string) => {statusInfo = status});
    window.terminalApi.loadHandler((terminalRecords: Array<TerminalRecord>) => {terminalBeforeHandler(terminalRecords)});
    window.terminalApi.recordsUpdateHandler((terminalRecord: TerminalRecord) => {terminalRecordUpdateHandler(terminalRecord)});
    window.logsConnectorApi.loadHandler((logs: Array<string>) => {logsConnectorBeforeHandler(logs)});
    window.logsConnectorApi.recordsUpdateHandler((log: string) => {logsConnectorRecordUpdateHandler(log)});

</script>

<div class="m">
    {#if currPage == "main"}
         <Main goto={goto}
            network={network}
            detectionResult={detectionResult}
            modifySetting={modifySetting}
            getIsSettingEnabled={getIsSettingEnabled}
            adbApi={adbApi}
            statusInfo={statusInfo}
            terminalApi={terminalApi}
            logsConnectorApi={logsConnectorApi}></Main>
    {:else if currPage == "settings"}
         <Settings goto={goto}
         modifySetting={modifySetting}
         firstLoaded={settings}></Settings>
    {:else if currPage == "load"}
         <Load></Load>
    {/if}
</div>

<style lang="scss">
    .m {
        height: 100%;
        width: 100%;
    }
</style>