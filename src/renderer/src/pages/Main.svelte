<script lang="ts">
    import BigButton from "../components/BigButton.svelte";
    import Logs from "../tabs/Logs.svelte";
    import Terminal from "../tabs/Terminal.svelte";
    import type { APIs } from "../apis.svelte";
    import MainLeftPanel from "../components/MainLeftPanel.svelte";
    import MainBottomPanel from "../components/MainBottomPanel.svelte";
    import { StateString } from "../../../common/types";
    import { Tab, tabsManager } from "../tabsManager.svelte";
    import IframeLoadingOverlay from "../components/IframeLoadingOverlay.svelte";
    import Manage from "../tabs/Manage.svelte";
    import ChangeNetworkSettings from "../tabs/ChangeNetworkSettings.svelte";
    import RebootConfirmation from "../tabs/RebootConfirmation.svelte";
    import PartialDashboard from "../tabs/PartialDashboard.svelte";
    import ChangeKeyboardGamepadEmulatorMapping from "../tabs/ChangeKeyboardGamepadEmulatorMapping.svelte";

    const props: { goto: Function, apis: APIs } = $props();
    const apis = props.apis;

    const wifiSubtext: string = $derived.by(() => {
        if ( !apis.networkApi.networkInfo.found ) { return ""; }
        if ( apis.pingerApi.pingerInfo.state.ch.disabled && apis.pingerApi.pingerInfo.state.dash.disabled ) { return "Auto-detection disabled"; }
        let found: string = "Nothing";
        if ( apis.pingerApi.pingerInfo.state.ch.found ) { found = "Device" }
        if ( apis.pingerApi.pingerInfo.state.dash.found ) {
            if ( found == "Nothing" ) { found = "Dashboard" }
            else { found += " and dashboard" }
        }
        return found + " detected";
    }) 

    const connectButtonColor: string = $derived.by(() => {
        switch ( apis.stateApi.state ) {
            case StateString.Idle:
            case StateString.Disabled:
            case StateString.NetworkChanged:
            case StateString.NetworkNotFound:
                return "#484848";
            case StateString.Detected:
                return "#00a2e8";
            case StateString.Connecting:
                return "#2c1366";
            case StateString.Connected:
                return "#28691B";
            case StateString.Disconnected:
                return "#e49c36";
            case StateString.Error:
                return "#6b1a1a";
        }
        return "#ffffff";
    })

    const connectButtonText: string = $derived.by(() => {
        if ( apis.stateApi.state == StateString.Connected ) { return "Disconnect ADB"; }
        else if ( apis.stateApi.state == StateString.Connecting ) { return "Connecting ADB"; }
        return "Connect ADB";
    })

    const autoConnectButtonColor: string = $derived(apis.settingsApi.settings.adb_autoconnect ? "#28691B" : "#484848")
    const autoConnectButtonText: string = $derived(apis.settingsApi.settings.adb_autoconnect ? "Auto-connect ADB / I" : "Auto-connect ADB / O")

    function handleConnectButtonClicked() {
        if ( apis.stateApi.state == StateString.Connecting ) { return; }
        if ( apis.stateApi.state == StateString.Connected ) {
            apis.adbApi.disconnect();
            apis.loggerApi.verbose("r: Disconnect sended");
            return;
        }
        apis.adbApi.connect();
        apis.loggerApi.verbose("r: Connect sended");
    }

    new Tab(() => window.innerWidth, "changeNetworkSettings", false);
    new Tab(() => window.innerWidth, "rebootConfirmation", false);
    new Tab(() => window.innerWidth, "changeKeyboardGamepadEmulatorMapping", false);

</script>

<div class="m">
    <div class="window-grid">
        <MainLeftPanel apis={apis} goto={props.goto}/>
        <div class="after-left-panel-grid">
            <div class="upper-panel-grid">
                <!-- svelte-ignore a11y_no_static_element_interactions -->
                <!-- svelte-ignore a11y_click_events_have_key_events -->
                <div class="buttons">
                    <div class="connect-button cursor-pointer" onclick={() => handleConnectButtonClicked()}>
                        <BigButton text={connectButtonText} color_={connectButtonColor}></BigButton>
                    </div>
                    <div class="auto-connect-button cursor-pointer" onclick={() => {
                        apis.settingsApi.updateSetting("adb_autoconnect", !apis.settingsApi.settings.adb_autoconnect);
                        }}>
                        <BigButton text={autoConnectButtonText} color_={autoConnectButtonColor}></BigButton>
                    </div>
                </div>
                <div class="wifi-info">
                    <div class="wifi-text">
                        <div class="name">{apis.networkApi.networkInfo.ssid}</div>
                        <div class="status">{wifiSubtext}</div>
                    </div>
                    <svg class="icon1" xmlns="http://www.w3.org/2000/svg" width="55" height="55" viewBox="0 0 24 24"><path d="M0 7.244c3.071-3.24 7.314-5.244 12-5.244 4.687 0 8.929 2.004 12 5.244l-2.039 2.15c-2.549-2.688-6.071-4.352-9.961-4.352s-7.412 1.664-9.961 4.352l-2.039-2.15zm5.72 6.034c1.607-1.696 3.827-2.744 6.28-2.744s4.673 1.048 6.28 2.744l2.093-2.208c-2.143-2.261-5.103-3.659-8.373-3.659s-6.23 1.398-8.373 3.659l2.093 2.208zm3.658 3.859c.671-.708 1.598-1.145 2.622-1.145 1.023 0 1.951.437 2.622 1.145l2.057-2.17c-1.197-1.263-2.851-2.044-4.678-2.044s-3.481.782-4.678 2.044l2.055 2.17zm2.622 1.017c-1.062 0-1.923.861-1.923 1.923s.861 1.923 1.923 1.923 1.923-.861 1.923-1.923-.861-1.923-1.923-1.923z"/></svg>
                </div>
            </div>
            <div class="tabs-place">
                {#if tabsManager.tabs.terminal?.show}
                    <div style:transform={"translate(0, " + tabsManager.tabs.terminal?.spring.current + "px)"} style:z-index={tabsManager.tabs.terminal?.zOrder} class="tab"><Terminal apis={apis}></Terminal></div>
                {/if}
                {#if tabsManager.tabs.logs?.show}
                    <div style:transform={"translate(0, " + tabsManager.tabs.logs?.spring.current + "px)"} style:z-index={tabsManager.tabs.logs?.zOrder} class="tab"><Logs apis={apis}></Logs></div>
                {/if}
                {#if tabsManager.tabs.manage?.show}
                    <!-- <iframe onload={() => {tabsManager.tabs.manage?.loaded()}} style:transform={"translate(" + -tabsManager.tabs.manage?.spring.current + "px, 0)"} style:z-index={tabsManager.tabs.manage?.zOrder} class="tab" title="manage" src="http://192.168.43.1:8080?page=connection.html&pop=true"></iframe>
                    {#if tabsManager.tabs.manage?.loading || !apis.pingerApi.pingerInfo.state.ch.found }
                        <IframeLoadingOverlay tabName={"Manage"} doesItPings={apis.pingerApi.pingerInfo.state.ch.found} tabId={"manage"}/>
                    {/if} -->
                    <div style:transform={"translate(" + -tabsManager.tabs.manage?.spring.current + "px, 0)"} style:z-index={tabsManager.tabs.manage?.zOrder} class="tab"><Manage apis={apis}/></div>
                {/if}
                {#if tabsManager.tabs.dashboard?.show}
                    <iframe style:transform={"translate(" + -tabsManager.tabs.dashboard?.spring.current + "px, 0)"} style:z-index={tabsManager.tabs.dashboard?.zOrder} class="tab" title="dashboard" src="http://192.168.43.1:8080/dash"></iframe>
                    {#if tabsManager.tabs.dashboard?.loading || !apis.pingerApi.pingerInfo.state.dash.found}
                        <IframeLoadingOverlay tabName={"Dashboard"} doesItPings={apis.pingerApi.pingerInfo.state.dash.found} tabId={"dashboard"}/>
                    {/if}
                {/if}
                {#if tabsManager.tabs.changeNetworkSettings?.show}
                    <div style:transform={"translate(" + tabsManager.tabs.changeNetworkSettings?.spring.current + "px, 0)"} style:z-index={tabsManager.tabs.changeNetworkSettings?.zOrder} class="tab"><ChangeNetworkSettings apis={apis}/></div>
                {/if}
                {#if tabsManager.tabs.rebootConfirmation?.show}
                    <div style:transform={"translate(" + tabsManager.tabs.rebootConfirmation?.spring.current + "px, 0)"} style:z-index={tabsManager.tabs.rebootConfirmation?.zOrder} class="tab"><RebootConfirmation apis={apis}/></div>
                {/if}
                {#if tabsManager.tabs.changeKeyboardGamepadEmulatorMapping?.show}
                    <div style:transform={"translate(" + tabsManager.tabs.changeKeyboardGamepadEmulatorMapping?.spring.current + "px, 0)"} style:z-index={tabsManager.tabs.changeKeyboardGamepadEmulatorMapping?.zOrder} class="tab"><ChangeKeyboardGamepadEmulatorMapping apis={apis}/></div>
                {/if}
                {#if !tabsManager.tabs.dashboard?.show && !tabsManager.tabs.changeKeyboardGamepadEmulatorMapping?.show && apis.settingsApi.settings.use_dashboard_on_main_page && apis.pingerApi.pingerInfo.state.dash.found }
                    <div class="tab"><PartialDashboard apis={apis} /></div>
                {/if}
            </div>
        </div>
    </div>
    <MainBottomPanel apis={apis}/>
</div>

<style lang="scss">
    $dark-one: #1E1E2A;
    $dark-two: #28283D;
    $background: #080809;
    $on-color: #28691B;
    $sub-text: #BDBDBD;
    :global(body) {
        margin: 0px;
        padding: 0px;
        @font-face {
            font-family: 'Ubuntu';
            src: url("../assets/Ubuntu-Regular.ttf");
        }
        font-family: 'Ubuntu', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background-color: $background;
        user-select: none;
        overflow: hidden;
    }
    .cursor-pointer {
        cursor: pointer;
    }
    .m {
        width: 100vw;
        height: 100vh;
        display: grid;
        grid-template-rows: auto 24px;
        .window-grid {
            display: grid;
            grid-template-columns: 24px auto;
            .after-left-panel-grid {
                display: grid;
                grid-template-rows: 85px auto;
                .upper-panel-grid {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    .buttons {
                        display: flex;
                        align-items: center;
                        justify-content: start;
                        // .connect-button {
                        //     padding-left: 20px;
                        // }
                        // .auto-connect-button {
                        //     padding-left: 10px;
                        // }
                    }
                    .wifi-info {
                        display: flex;
                        align-items: center;
                        justify-content: end;
                        color: white;
                        .icon1 {
                            fill: white;
                            padding-left: 10px;
                            padding-right: 10px;
                        }
                        .wifi-text {
                            display: flex;
                            flex-direction: column;
                            justify-content: space-between;
                            align-items: end;
                            .name {
                                font-size: 22px;
                            }
                            .status {
                                font-size: 16px;
                                color: $sub-text;
                            }
                        }
                    }
                }
            }
        }
    }
    .tab {
        height: calc(100vh - 24px - 85px);
        width: calc(100vw - 24px);
        position: absolute;
    }
    iframe {
        height: 100%;
        width: 100%;
        border: 0px solid $background;
    }
</style>