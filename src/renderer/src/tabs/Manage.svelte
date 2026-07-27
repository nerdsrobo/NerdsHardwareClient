<script lang="ts">
    import type { APIs } from "../apis.svelte";
    import Button from "../components/Button.svelte";
    import { tabsManager } from "../tabsManager.svelte";

    const props: { apis: APIs } = $props();
    const apis = props.apis;

    let isWiFiPasswordShow = $state(false);

    apis.manageApiApi.getRcInfo();
    apis.manageApiApi.rcInfoStore.sub(_info => isWiFiPasswordShow = false)

</script>

<div class="m">
    <div class="info">
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <svg xmlns="http://www.w3.org/2000/svg" class="cursor-pointer" onclick={() => {props.apis.manageApiApi.getRcInfo()}} width="28" height="28" viewBox="0 0 24 24"><path d="M5 12a7 7 0 0 1 11.89-5H14a1 1 0 0 0 0 2h5.08A1 1 0 0 0 20 8V3a1 1 0 0 0-2 0v2.32A9 9 0 0 0 3 12a1 1 0 0 0 2 0M20 11a1 1 0 0 0-1 1 7 7 0 0 1-11.89 5H10a1 1 0 0 0 0-2H4.92A1 1 0 0 0 4 16v5a1 1 0 0 0 2 0v-2.32A9 9 0 0 0 21 12a1 1 0 0 0-1-1"/></svg>
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        {#if apis.manageApiApi.rcInfoStore.state}
             <svg xmlns="http://www.w3.org/2000/svg" class="cursor-pointer" onclick={() => {tabsManager.tabs.rebootConfirmation?.open()}} width="28" height="28" fill="none" viewBox="0 0 24 24"><path fill="#000" fill-rule="evenodd" d="M13 3a1 1 0 1 0-2 0v9a1 1 0 1 0 2 0zM8.61 5.874a1 1 0 0 0-.971-1.748 9 9 0 1 0 8.862.079 1 1 0 1 0-1.002 1.73 7 7 0 1 1-6.89-.061" clip-rule="evenodd"/></svg>
        {/if}
        <br>
        {#if apis.manageApiApi.rcInfoStore.state}
            <b>Network Info</b><br>
            <b>SSID:</b> {apis.manageApiApi.rcInfoStore.state.networkName}<br>
            <b>Password:</b> {isWiFiPasswordShow ? apis.manageApiApi.rcInfoStore.state.passphrase : "*****"}
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            {#if isWiFiPasswordShow}
                <!-- svelte-ignore a11y_click_events_have_key_events -->
                <svg onclick={() => {isWiFiPasswordShow = false;}} class="eye cursor-pointer" color-profile="white" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24"><path fill="#0f0f0f" d="M4.496 7.44c-.949.678-1.718 1.402-2.307 2.04a3.68 3.68 0 0 0 0 5.04C3.917 16.391 7.19 19 12 19c1.296 0 2.48-.19 3.552-.502l-1.662-1.663A11 11 0 0 1 12 17c-4.033 0-6.812-2.18-8.341-3.837a1.68 1.68 0 0 1 0-2.326 13 13 0 0 1 2.273-1.96z"/><path fill="#0f0f0f" d="M8.533 11.478q-.038.256-.039.522a3.5 3.5 0 0 0 4.022 3.461zM15.466 12.447l-3.919-3.919q.22-.027.447-.028a3.5 3.5 0 0 1 3.472 3.947"/><path fill="#0f0f0f" d="M18.112 15.093a13 13 0 0 0 2.23-1.93 1.68 1.68 0 0 0 0-2.326C18.811 9.18 16.032 7 12 7c-.64 0-1.25.055-1.827.154L8.505 5.486A12.6 12.6 0 0 1 12 5c4.811 0 8.083 2.609 9.81 4.48a3.68 3.68 0 0 1 0 5.04c-.58.629-1.334 1.34-2.263 2.008zM2.008 3.422a1 1 0 1 1 1.414-1.414L22 20.586A1 1 0 1 1 20.586 22z"/></svg>
            {:else}
                <!-- svelte-ignore a11y_click_events_have_key_events -->
                <svg onclick={() => {isWiFiPasswordShow = true;}} class="eye cursor-pointer" color-profile="white" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24"><path fill="#0f0f0f" fill-rule="evenodd" d="M11.994 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m0-2.006a1.494 1.494 0 1 1 0-2.988 1.494 1.494 0 0 1 0 2.988" clip-rule="evenodd"/><path fill="#0f0f0f" fill-rule="evenodd" d="M12 5C7.189 5 3.917 7.609 2.19 9.48a3.68 3.68 0 0 0 0 5.04C3.916 16.391 7.188 19 12 19s8.083-2.609 9.81-4.48a3.68 3.68 0 0 0 0-5.04C20.084 7.609 16.812 5 12 5m-8.341 5.837C5.189 9.18 7.967 7 12 7s6.812 2.18 8.341 3.837a1.68 1.68 0 0 1 0 2.326C18.811 14.82 16.033 17 12 17s-6.812-2.18-8.341-3.837a1.68 1.68 0 0 1 0-2.326" clip-rule="evenodd"/></svg>
            {/if}<br>
            <b>Wi-Fi Channel:</b> {`${apis.manageApiApi.rcInfoStore.state.currentChannel.displayName}${apis.manageApiApi.rcInfoStore.state.currentChannel.name.startsWith("AUTO") ? "" : (apis.manageApiApi.rcInfoStore.state.currentChannel.band == "BAND_2_4_GHZ" ? " (2.4GHz)" : " (5GHz)")}`}<br>
            <Button text={"Change Network Settings"} onclick={() => {tabsManager.tabs.changeNetworkSettings?.open()}}/>
            <br>
            <b>Connected Hubs:</b><br>
            <div class="hubs">
                {#each apis.manageApiApi.rcInfoStore.state.revHubNamesAndVersions as hub}
                    <div class="hub">
                        <div><b>{hub.name}</b></div>
                        <div><b>Firmware Version:</b> {hub.firmwareVersion}</div>
                        <div><b>IMU:</b> {hub.imuType}</div>
                    </div>
                {/each}
            </div>
            <br>
            <b>Active Config Name:</b> {apis.manageApiApi.rcInfoStore.state.activeConfigName}<br>
            <b>Robot Controller Verison:</b> {apis.manageApiApi.rcInfoStore.state.rcVersion}<br>
            <b>SDK Version:</b> {apis.manageApiApi.rcInfoStore.state.sdkVersion}<br>
            <b>Control Hub OS Version:</b> {apis.manageApiApi.rcInfoStore.state.chOsVersion}
        {:else if apis.manageApiApi.rcInfoGetterErr}
            Information load failed, see logs for more info
        {:else}
            Information is now loading...
        {/if}
    </div>
</div>

<style lang="scss">
    $dark-one: #1E1E2A;
    $dark-two: #28283D;
    $background: #080809;
    $on-color: #28691B;
    $sub-text: #BDBDBD;
    .m {
        position: absolute;
        width: 100%;
        height: 100%;
        color: white;
        background-color: $dark-one;
        border-radius: 25px;
        display: flex;
        align-items: center;
        justify-content: start;
        .info {
            padding-left: 15px;
            font-size: 18px;
            .hubs {
                display: flex;
                justify-content: start;
                .hub {
                    display: flex;
                    flex-direction: column;
                    padding: 10px;
                    border-radius: 15px;
                    background-color: $dark-two;
                }
            }
            .eye {
                position: relative;
                top: 1px;
            }
        }
    }
    .cursor-pointer {
        cursor: pointer;
    }
    path {
        fill: white; 
    }
</style>