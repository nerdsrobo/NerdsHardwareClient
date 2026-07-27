<script lang="ts">
    import type { WiFiChannel } from "../../../common/rcManagerTypes";
    import type { APIs } from "../apis.svelte";
    import Button from "../components/Button.svelte";
    import Dropdown from "../components/Dropdown.svelte";
    import { tabsManager } from "../tabsManager.svelte";

    const props: { apis: APIs } = $props();
    const apis = props.apis;

    let newNetworkName = $state($state.snapshot(apis.manageApiApi.rcInfoStore.state)?.networkName ?? "");
    let newNetworkPassword = $state($state.snapshot(apis.manageApiApi.rcInfoStore.state)?.passphrase ?? "");
    let newNetworkPasswordConfirm = $state($state.snapshot(apis.manageApiApi.rcInfoStore.state)?.passphrase ?? "");
    let newNetworkChannel: WiFiChannel | null = $state($state.snapshot(apis.manageApiApi.rcInfoStore.state)?.currentChannel ?? null);
    let channels: Array<WiFiChannel> | null = $state($state.snapshot(apis.manageApiApi.rcInfoStore.state)?.availableChannels ?? null);

    let passwordDoesntMatchErr = $state(false);

    let selectedChannelIndex = $state(-1);
    channels.forEach((channel, i) => {
        if ( newNetworkChannel.name == channel.name ) {
            selectedChannelIndex = i;
            return;
        }
    });

    function submitSettings() {
        if ( newNetworkPassword != newNetworkPasswordConfirm ) {
            passwordDoesntMatchErr = true;
            return;
        }
        apis.manageApiApi.changeNetwowrkInfo($state.snapshot(newNetworkName), $state.snapshot(newNetworkPassword), selectedChannelIndex == -1 ? {
            name: "AUTO_2_4_GHZ",
            displayName: "auto (2.4 GHz)",
            band: "BAND_2_4_GHZ",
            overlapsWithOtherChannels: false
        } : channels[selectedChannelIndex]);
        tabsManager.tabs.changeNetworkSettings?.hide();
    }
    function cancelSettingsUpdate() {
        tabsManager.tabs.manage?.open();
    }

</script>

<div class="m">
    <div class="settings">
        <div><b>SSID:</b> <input type="text" bind:value={newNetworkName}></div>
        <div><b>Password:</b> <input type="text" bind:value={newNetworkPassword} onfocus={() => {passwordDoesntMatchErr = false}}></div>
        <div><b>Confirm Password:</b> <input type="text" bind:value={newNetworkPasswordConfirm} onfocus={() => {passwordDoesntMatchErr = false;}}></div>
        {#if channels}
            <Dropdown items={channels.map(channel => `Channel ${channel.displayName}${channel.name.startsWith("AUTO") ? "" : (channel.band == "BAND_2_4_GHZ" ? " (2.4GHz)" : " (5GHz)")}`)}
            bind:selectedIndex={selectedChannelIndex}
            notSelectedText={"Select Wi-Fi Channel"}
            dropdownHeight={"150px"} />
        {:else}
            Channels list unavailable, so Wi-Fi channel locked to Auto 2.4GHz
        {/if}
        {#if passwordDoesntMatchErr}
            Passwords doesn't match
        {:else}
            <div></div>
        {/if}
        <Button text={"Cancel"} onclick={() => {cancelSettingsUpdate()}} />
        <Button text={"Apply Wi-Fi settings"} onclick={() => {submitSettings()}} />
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
        .settings {
            display: flex;
            flex-direction: column;
            align-items: start;
            gap: 5px;
            padding-left: 15px;
            font-size: 18px;
            input {
                font-family: 'Ubuntu', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                font-size: 16px;
                color: white;
                background: black;
                border: none;
                outline: none;
                border-radius: 7px;
                padding: 4px;
            }
        }
    }
    // .cursor-pointer {
    //     cursor: pointer;
    // }
    // path {
    //     fill: white; 
    // }
</style>