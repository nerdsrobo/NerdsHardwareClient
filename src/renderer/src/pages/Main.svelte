<script lang="ts">
    import { Spring } from "svelte/motion";
    import Button from "../components/Button.svelte";
    import Logs from "../windows/Logs.svelte";
    import Terminal from "../windows/Terminal.svelte";

    // import type SettingsType from "../../../preload/index";

    const props: {
        goto: Function,
        network: {ssid: string, found: boolean},
        modifySetting: (key: string, newval: boolean) => void,
        detectionResult: {ch: {success: boolean, disabled: boolean}, dash: {success: boolean, disabled: boolean}},
        getIsSettingEnabled: (key: string) => boolean,
        adbApi: {connect: (callback: (isSuccess: boolean) => void) => void, disconnect: (callback: (isSuccess: boolean) => void) => void},
        statusInfo: string,
        terminalApi: {load: (callback) => void, setRecordUpdateHandler: (callback) => void, exec: (stdin: string) => void},
        logsConnectorApi: {load: (callback) => void, setRecordUpdateHandler: (callback) => void}
    } = $props();

    const wifiSubtext: string = $derived.by(() => {
        if ( !props.network.found ) { return ""; }
        if ( props.detectionResult.ch.disabled && props.detectionResult.dash.disabled ) { return "Auto-detection disabled"; }
        let found: string = "Nothing";
        if ( props.detectionResult.ch.success ) { found = "Device" }
        if ( props.detectionResult.dash.success ) {
            if ( found == "Nothing" ) { found = "Dashboard" }
            else { found += " and dashboard" }
        }
        return found + " detected";
    })

    const connectButtonColor: string = $derived.by(() => {
        switch ( props.statusInfo ) {
            case "Started":
                return "#ffffff";
            case "Device detected":
                return "#00a2e8";
            case "Connecting":
                return "#2c1366";
            case "Auto-detection disabled":
            case "Idle":
            case "Network changed":
            case "Network not found":
                return "#484848";
            case "Connected":
                return "#28691B";
            case "Disconnected":
                return "#e49c36";
            case "Failed":
                return "#6b1a1a";
        }
        return "#ffffff";
    })

    const connectButtonText: string = $derived.by(() => {
        if ( props.statusInfo == "Connected" ) { return "Disconnect ADB"; }
        else if ( props.statusInfo == "Connecting" ) { return "Connecting ADB"; }
        return "Connect ADB";
    })

    const autoConnectButtonColor: string = $derived(props.getIsSettingEnabled("adb_autoconnect") ? "#28691B" : "#484848")
    const autoConnectButtonText: string = $derived(props.getIsSettingEnabled("adb_autoconnect") ? "Auto-connect ADB / I" : "Auto-connect ADB / O")

    const handleConnectionResult = (isSuccess: boolean) => {
        console.log(isSuccess);
    }
    function handleDisconnectionResult(isSuccess: boolean) {
        console.log(isSuccess);
    }

    function handleConnectButtonClicked() {
        if ( props.statusInfo != "Connected" ) {
            props.adbApi.connect(handleConnectionResult)
        }
        // @ts-ignore
        else if ( props.statusInfo != "Connecting" ) {
            props.adbApi.disconnect(handleDisconnectionResult)
        }
    }

    // enum WindowOpened {
    //     null, terminal, logs, manage, dashboard
    // }

    let windowOpened = $state('null');
    
    const terminalArrowAngle = $derived(windowOpened == "terminal" ? 180 : 0);
    const logsArrowAngle = $derived(windowOpened == "logs" ? 180 : 0);
    const manageArrowAngle = $derived(windowOpened == "manage" ? 90 : -90);
    const dashboardArrowAngle = $derived(windowOpened == "dashboard" ? 90 : -90);

    const windowShouldStay = $state({terminal: false, logs: false, manage: false, dashboard: false});

    const windowAnimateNow = $state({terminal: false, logs: false, manage: false, dashboard: false});

    const terminalSpring = new Spring(0);
    const logsSpring = new Spring(0);
    const manageSpring = new Spring(0);
    const dashboardSpring = new Spring(0);

    const windowZOrders = $state({terminal: 3, logs: 3, manage: 3, dashboard: 3}); $inspect(windowZOrders)

    let windowStopAnimate: () => void = () => {}

    function handleTerminalClicked() {
        windowStopAnimate();
        if ( windowOpened == "terminal" ) {
            windowStopAnimate = () => {windowShouldStay.terminal = false; windowStopAnimate = () => {}}
            windowShouldStay.terminal = true;
            windowOpened = "null";
            terminalSpring.set(0, {instant: true});
            terminalSpring.set(window.innerHeight).then(() => {windowShouldStay.terminal = false; windowStopAnimate = () => {}});
        }
        else if ( windowOpened == "null" ) {
            windowStopAnimate = () => {terminalSpring.set(0, {instant: true}); windowStopAnimate = () => {}}
            terminalSpring.set(window.innerHeight, {instant: true});
            windowOpened = "terminal";
            terminalSpring.set(0).then(() => {windowStopAnimate = () => {}})
        }
        else {
            const lastOpened = windowOpened;
            windowStopAnimate = () => {terminalSpring.set(0, {instant: true}); windowAnimateNow.terminal = false; windowShouldStay[lastOpened] = false; windowZOrders[lastOpened] = 3; windowStopAnimate = () => {}}
            windowShouldStay[lastOpened] = true;
            windowZOrders[lastOpened] = 1;
            windowAnimateNow[lastOpened] = true;
            windowAnimateNow.terminal = true;
            terminalSpring.set(window.innerHeight, {instant: true});
            windowOpened = "terminal"
            terminalSpring.set(0).then(() => {windowAnimateNow.terminal = false; windowShouldStay[lastOpened] = false; windowZOrders[lastOpened] = 3; windowStopAnimate = () => {}})
        }
    }

    function handleLogsClicked() {
        windowStopAnimate();
        if ( windowOpened == "logs" ) {
            windowStopAnimate = () => {windowShouldStay.logs = false; windowStopAnimate = () => {}}
            windowShouldStay.logs = true;
            windowOpened = "null";
            logsSpring.set(0, {instant: true});
            logsSpring.set(window.innerHeight).then(() => {windowShouldStay.logs = false; windowStopAnimate = () => {}});
        }
        else if ( windowOpened == "null" ) {
            windowStopAnimate = () => {logsSpring.set(0, {instant: true}); windowStopAnimate = () => {}}
            logsSpring.set(window.innerHeight, {instant: true});
            windowOpened = "logs";
            logsSpring.set(0).then(() => {windowStopAnimate = () => {}})
        }
        else {
            const lastOpened = windowOpened;
            windowStopAnimate = () => {logsSpring.set(0, {instant: true}); windowAnimateNow.logs = false; windowShouldStay[lastOpened] = false; windowZOrders[lastOpened] = 3; windowStopAnimate = () => {}}
            windowShouldStay[lastOpened] = true;
            windowZOrders[lastOpened] = 1;
            windowAnimateNow[lastOpened] = true;
            windowAnimateNow.logs = true;
            logsSpring.set(window.innerHeight, {instant: true});
            windowOpened = "logs"
            logsSpring.set(0).then(() => {windowAnimateNow.logs = false; windowShouldStay[lastOpened] = false; windowZOrders[lastOpened] = 3; windowStopAnimate = () => {}})
        }
    }

    function handleManageClicked() {
        windowStopAnimate();
        if ( windowOpened == "manage" ) {
            windowStopAnimate = () => {windowShouldStay.manage = false; windowStopAnimate = () => {}}
            windowShouldStay.manage = true;
            windowOpened = "null";
            manageSpring.set(0, {instant: true});
            manageSpring.set(window.innerWidth).then(() => {windowShouldStay.manage = false; windowStopAnimate = () => {}});
        }
        else if ( windowOpened == "null" ) {
            windowStopAnimate = () => {manageSpring.set(0, {instant: true}); windowStopAnimate = () => {}}
            manageSpring.set(window.innerWidth, {instant: true});
            windowOpened = "manage";
            manageSpring.set(0).then(() => {windowStopAnimate = () => {}})
        }
        else {
            const lastOpened = windowOpened;
            windowStopAnimate = () => {manageSpring.set(0, {instant: true}); windowAnimateNow.manage = false; windowShouldStay[lastOpened] = false; windowZOrders[lastOpened] = 3; windowStopAnimate = () => {}}
            windowShouldStay[lastOpened] = true;
            windowZOrders[lastOpened] = 1;
            windowAnimateNow[lastOpened] = true;
            windowAnimateNow.manage = true;
            manageSpring.set(window.innerWidth, {instant: true});
            windowOpened = "manage"
            manageSpring.set(0).then(() => {windowAnimateNow.manage = false; windowShouldStay[lastOpened] = false; windowZOrders[lastOpened] = 3; windowStopAnimate = () => {}})
        }
    }

    function handleDashboardClicked() {
        windowStopAnimate();
        if ( windowOpened == "dashboard" ) {
            windowStopAnimate = () => {windowShouldStay.dashboard = false; windowStopAnimate = () => {}}
            windowShouldStay.dashboard = true;
            windowOpened = "null";
            dashboardSpring.set(0, {instant: true});
            dashboardSpring.set(window.innerWidth).then(() => {windowShouldStay.dashboard = false; windowStopAnimate = () => {}});
        }
        else if ( windowOpened == "null" ) {
            windowStopAnimate = () => {dashboardSpring.set(0, {instant: true}); windowStopAnimate = () => {}}
            dashboardSpring.set(window.innerWidth, {instant: true});
            windowOpened = "dashboard";
            dashboardSpring.set(0).then(() => {windowStopAnimate = () => {}})
        }
        else {
            const lastOpened = windowOpened;
            windowStopAnimate = () => {dashboardSpring.set(0, {instant: true}); windowAnimateNow.dashboard = false; windowShouldStay[lastOpened] = false; windowZOrders[lastOpened] = 3; windowStopAnimate = () => {}}
            windowShouldStay[lastOpened] = true;
            windowZOrders[lastOpened] = 1;
            windowAnimateNow[lastOpened] = true;
            windowAnimateNow.dashboard = true;
            dashboardSpring.set(window.innerWidth, {instant: true});
            windowOpened = "dashboard"
            dashboardSpring.set(0).then(() => {windowAnimateNow.dashboard = false; windowShouldStay[lastOpened] = false; windowZOrders[lastOpened] = 3; windowStopAnimate = () => {}})
        }
    }

    // asd
</script>

<div class="m">
    <div class="grid1-r1">
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div class="grid2-c1 left-panel" style={props.getIsSettingEnabled("display_dash") ? "grid-template-rows: 85px 1px 1fr 1px 1fr" : "grid-template-rows: 85px 1px 1fr"}>
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <div class="left-panel-settings cursor-pointer" onclick={() => {props.goto("settings")}}>
                <svg class="icon1" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path d="M24 14.187v-4.374c-2.148-.766-2.726-.802-3.027-1.529-.303-.729.083-1.169 1.059-3.223l-3.093-3.093c-2.026.963-2.488 1.364-3.224 1.059-.727-.302-.768-.889-1.527-3.027h-4.375c-.764 2.144-.8 2.725-1.529 3.027-.752.313-1.203-.1-3.223-1.059l-3.093 3.093c.977 2.055 1.362 2.493 1.059 3.224-.302.727-.881.764-3.027 1.528v4.375c2.139.76 2.725.8 3.027 1.528.304.734-.081 1.167-1.059 3.223l3.093 3.093c1.999-.95 2.47-1.373 3.223-1.059.728.302.764.88 1.529 3.027h4.374c.758-2.131.799-2.723 1.537-3.031.745-.308 1.186.099 3.215 1.062l3.093-3.093c-.975-2.05-1.362-2.492-1.059-3.223.3-.726.88-.763 3.027-1.528zm-4.875.764c-.577 1.394-.068 2.458.488 3.578l-1.084 1.084c-1.093-.543-2.161-1.076-3.573-.49-1.396.581-1.79 1.693-2.188 2.877h-1.534c-.398-1.185-.791-2.297-2.183-2.875-1.419-.588-2.507-.045-3.579.488l-1.083-1.084c.557-1.118 1.066-2.18.487-3.58-.579-1.391-1.691-1.784-2.876-2.182v-1.533c1.185-.398 2.297-.791 2.875-2.184.578-1.394.068-2.459-.488-3.579l1.084-1.084c1.082.538 2.162 1.077 3.58.488 1.392-.577 1.785-1.69 2.183-2.875h1.534c.398 1.185.792 2.297 2.184 2.875 1.419.588 2.506.045 3.579-.488l1.084 1.084c-.556 1.121-1.065 2.187-.488 3.58.577 1.391 1.689 1.784 2.875 2.183v1.534c-1.188.398-2.302.791-2.877 2.183zm-7.125-5.951c1.654 0 3 1.346 3 3s-1.346 3-3 3-3-1.346-3-3 1.346-3 3-3zm0-2c-2.762 0-5 2.238-5 5s2.238 5 5 5 5-2.238 5-5-2.238-5-5-5z"/></svg>
            </div>
            <div class="left-panel-line1 panel-line"></div>
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <div class="left-panel-manage cursor-pointer" onclick={() => {handleManageClicked()}}>
                <svg style={"transform: rotate(" + manageArrowAngle + "deg);"} class="arrow" viewBox="0 0 24 20" width="13" height="13" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd"><path d="M11.574 3.712c.195-.323.662-.323.857 0l9.37 15.545c.2.333-.039.757-.429.757l-18.668-.006c-.385 0-.629-.422-.428-.758l9.298-15.538zm.429-2.483c-.76 0-1.521.37-1.966 1.111l-9.707 16.18c-.915 1.523.182 3.472 1.965 3.472h19.416c1.783 0 2.879-1.949 1.965-3.472l-9.707-16.18c-.446-.741-1.205-1.111-1.966-1.111z"/></svg>
                <div class="text">  Manage</div>
            </div>
            {#if props.getIsSettingEnabled("display_dash") }
                <div class="left-panel-line2 panel-line"></div>
                <!-- svelte-ignore a11y_click_events_have_key_events -->
                <div class="left-panel-dashboard cursor-pointer" onclick={() => {handleDashboardClicked()}}>
                    <svg style={"transform: rotate(" + dashboardArrowAngle + "deg);"} class="arrow" viewBox="0 0 24 20" width="13" height="13" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd"><path d="M11.574 3.712c.195-.323.662-.323.857 0l9.37 15.545c.2.333-.039.757-.429.757l-18.668-.006c-.385 0-.629-.422-.428-.758l9.298-15.538zm.429-2.483c-.76 0-1.521.37-1.966 1.111l-9.707 16.18c-.915 1.523.182 3.472 1.965 3.472h19.416c1.783 0 2.879-1.949 1.965-3.472l-9.707-16.18c-.446-.741-1.205-1.111-1.966-1.111z"/></svg>
                    <div class="text">  Dashboard</div>
                </div>
            {/if}
            
        </div>
        <div class="grid3">
            <div class="grid2-c2">
                <!-- svelte-ignore a11y_no_static_element_interactions -->
                <!-- svelte-ignore a11y_click_events_have_key_events -->
                <div class="buttons">
                    <div class="connect-button cursor-pointer" onclick={() => handleConnectButtonClicked()}>
                        <Button text={connectButtonText} color_={connectButtonColor}></Button>
                    </div>
                    <div class="auto-connect-button cursor-pointer" onclick={() => {props.modifySetting("adb_autoconnect", !props.getIsSettingEnabled("adb_autoconnect"))}}>
                        <Button text={autoConnectButtonText} color_={autoConnectButtonColor}></Button>
                    </div>
                </div>
                <div class="wifi-info">
                    <div class="wifi-text">
                        <div class="name">{props.network.ssid}</div>
                        <div class="status">{wifiSubtext}</div>
                    </div>
                    <svg class="icon1" xmlns="http://www.w3.org/2000/svg" width="55" height="55" viewBox="0 0 24 24"><path d="M0 7.244c3.071-3.24 7.314-5.244 12-5.244 4.687 0 8.929 2.004 12 5.244l-2.039 2.15c-2.549-2.688-6.071-4.352-9.961-4.352s-7.412 1.664-9.961 4.352l-2.039-2.15zm5.72 6.034c1.607-1.696 3.827-2.744 6.28-2.744s4.673 1.048 6.28 2.744l2.093-2.208c-2.143-2.261-5.103-3.659-8.373-3.659s-6.23 1.398-8.373 3.659l2.093 2.208zm3.658 3.859c.671-.708 1.598-1.145 2.622-1.145 1.023 0 1.951.437 2.622 1.145l2.057-2.17c-1.197-1.263-2.851-2.044-4.678-2.044s-3.481.782-4.678 2.044l2.055 2.17zm2.622 1.017c-1.062 0-1.923.861-1.923 1.923s.861 1.923 1.923 1.923 1.923-.861 1.923-1.923-.861-1.923-1.923-1.923z"/></svg>
                </div>
            </div>
            <div class="window-place">
                {#if windowOpened == "terminal" || windowShouldStay.terminal}
                    <div style:transform={"translate(0, " + terminalSpring.current + "px)"} style:position={windowAnimateNow.terminal ? "absolute" : "static"} style={"z-index: " + windowZOrders.terminal + ";" + (windowAnimateNow.terminal ? "width: calc(100vw - 24px)" : "")}><Terminal terminalApi={props.terminalApi}></Terminal></div>
                {/if}
                {#if windowOpened == "logs" || windowShouldStay.logs}
                    <div style:transform={"translate(0, " + logsSpring.current + "px)"} style:z-index={windowZOrders.logs} style:position={windowAnimateNow.logs ? "absolute" : "relative"} style={windowAnimateNow.logs ? "width: calc(100vw - 24px)" : ""}><Logs logsConnectorApi={props.logsConnectorApi}></Logs></div>
                {/if}
                {#if windowOpened == "manage" || windowShouldStay.manage}
                    <!-- <div style:transform={"translate(" + -manageSpring.current + "px, 0)"} style:z-index={windowZOrders.manage-1} style:position="relative" style={windowAnimateNow.manage ? "width: calc(100vw - 24px)" : "width: 100%"}><div style:width="100%" style:height="100%" style:display="flex" style:align-items="center" style:justify-content="center" style:color="white">Loading...</div></div> -->
                    <iframe style:transform={"translate(" + -manageSpring.current + "px, 0)"} style:z-index={windowZOrders.manage} style:position={windowAnimateNow.manage ? "absolute" : "relative"} style={windowAnimateNow.manage ? "width: calc(100vw - 24px)" : "width: 100%"} class="window-manage-dash" title="manage" src="http://192.168.43.1:8080?page=connection.html&pop=true"></iframe>
                {/if}
                {#if windowOpened == "dashboard" || windowShouldStay.dashboard}
                    <!-- <div style:transform={"traslate(" + -dashboardSpring.current + "px, 0)"} style:z-index={windowZOrders.dashboard+1} style:position={windowAnimateNow.terminal ? "absolute" : "relative"} style={windowAnimateNow.dashboard ? "width: calc(100vw - 24px)" : "width: 100%"}><div style:width="100%" style:height="100%" style:display="flex" style:align-items="center" style:justify-content="center"></div></div> -->
                    <iframe style:transform={"translate(" + -dashboardSpring.current + "px, 0)"} style:z-index={windowZOrders.dashboard} style:position={windowAnimateNow.terminal ? "absolute" : "relative"} style={windowAnimateNow.dashboard ? "width: calc(100vw - 24px)" : "width: 100%"} class="window-manage-dash" title="dashboard" src="http://192.168.43.1:8080/dash"></iframe>
                {/if}
            </div>
        </div>
            
    </div>
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="grid1-r2 bottom-panel">
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <div class="bottom-panel-state-terminal cursor-pointer" onclick={() => {handleTerminalClicked()}}>
            <div class="state">{props.statusInfo}</div>
            <div class="terminal">
                <svg style={"transform: rotate(" + terminalArrowAngle + "deg);"} class="arrow" viewBox="0 0 24 20" width="13" height="13" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd"><path d="M11.574 3.712c.195-.323.662-.323.857 0l9.37 15.545c.2.333-.039.757-.429.757l-18.668-.006c-.385 0-.629-.422-.428-.758l9.298-15.538zm.429-2.483c-.76 0-1.521.37-1.966 1.111l-9.707 16.18c-.915 1.523.182 3.472 1.965 3.472h19.416c1.783 0 2.879-1.949 1.965-3.472l-9.707-16.18c-.446-.741-1.205-1.111-1.966-1.111z"/></svg>
                <div class="text">Terminal</div>
                <!-- <svg class="icon1" viewBox="0 0 24 24" width="18" height="18" clip-rule="evenodd" fill-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2" xmlns="http://www.w3.org/2000/svg"><path d="m21 4c0-.478-.379-1-1-1h-16c-.62 0-1 .519-1 1v16c0 .621.52 1 1 1h16c.478 0 1-.379 1-1zm-16.5.5h15v15h-15zm2.818 5.865 2.635 1.622-2.641 1.645c-.207.146-.318.378-.318.613 0 .601.682.966 1.182.613l3.511-2.257c.199-.141.318-.369.318-.614 0-.244-.119-.472-.318-.613l-3.505-2.235c-.498-.35-1.182.009-1.182.612 0 .236.111.468.318.614zm9.678 3.873c0-.414-.336-.75-.75-.75h-3.5c-.413 0-.75.336-.75.75s.337.75.75.75h3.5c.414 0 .75-.336.75-.75z" fill-rule="nonzero"/></svg> -->
            </div>
        </div>
        <div class="bottom-panel-line panel-line"></div>
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <div class="bottom-panel-logs cursor-pointer" onclick={() => {handleLogsClicked()}}>
            <svg style={"transform: rotate(" + logsArrowAngle + "deg);"} class="arrow" viewBox="0 0 24 20" width="13" height="13" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd"><path d="M11.574 3.712c.195-.323.662-.323.857 0l9.37 15.545c.2.333-.039.757-.429.757l-18.668-.006c-.385 0-.629-.422-.428-.758l9.298-15.538zm.429-2.483c-.76 0-1.521.37-1.966 1.111l-9.707 16.18c-.915 1.523.182 3.472 1.965 3.472h19.416c1.783 0 2.879-1.949 1.965-3.472l-9.707-16.18c-.446-.741-1.205-1.111-1.966-1.111z"/></svg>
            <div class="text">Logs</div>
            <!-- <svg class="icon1" viewBox="0 0 24 24" width="14" height="14" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd"><path d="M0 12l11 3.1 7-8.1-8.156 5.672-4.312-1.202 15.362-7.68-3.974 14.57-3.75-3.339-2.17 2.925v-.769l-2-.56v7.383l4.473-6.031 4.527 4.031 6-22z"/></svg> -->
        </div>
    </div>
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
            src: url("./assets/Ubuntu-Regular.ttf");
        }
        font-family: 'Ubuntu', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background-color: $background;
        user-select: none;
        overflow: hidden;
    }
    .m {
        width: 100vw;
        height: 100vh;
        display: grid;
        grid-template-rows: auto 24px;
        .panel-line {
            background-color: white;
        }
        .bottom-panel {
            z-index: 5;
            background-color: $dark-one;
            color: white;
            display: grid;
            grid-template-columns: 4fr 1px 1fr;
            font-size: 16px;
            .bottom-panel-state-terminal {
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
                .state {
                    position: relative;
                    top: -1px;
                    padding-left: 10px;
                }
                .terminal {
                    position: relative;
                    top: -1px;
                    display: flex;
                    justify-content: end;
                    align-items: center;
                    padding-right: 25px;
                    .arrow {
                        fill: white;
                        transition: transform 0.5s ease-in-out;
                    }
                    .text {
                        padding-left: 7px;
                    }
                    // .icon1 {
                    //     padding-left: 8px;
                    //     fill: white;
                    // }
                }
            }
            .bottom-panel-logs {
                display: flex;
                flex-direction: row;
                justify-content: start;
                align-items: center;
                position: relative;
                top: -1px;
                padding-left: 25px;
                .arrow {
                    fill: white;
                    transition: transform 0.5s ease-in-out;
                }
                .text {
                    padding-left: 7px;
                }
                // .icon1 {
                //     padding-left: 8px;
                //     fill: white;
                // }
            }
        }
        .grid1-r1 {
            display: grid;
            grid-template-columns: 24px auto;
            .left-panel {
                z-index: 5;
                background-color: $dark-two;
                color: white;
                display: grid;
                // grid-template-rows: 85px 1px 1fr 1px 1fr;
                .left-panel-settings {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    .icon1 {
                        fill: white;
                    }
                }
                .left-panel-manage {
                    position: relative;
                    // left: -2.5px;
                    display: flex;
                    flex-direction: row;
                    justify-content: center;
                    align-items: center;
                    writing-mode: vertical-lr;
                    transform: rotate(180deg); // я ненавижу эту вещь
                    .arrow {
                        // padding-left: 15px;
                        fill: white;
                        // transform: rotate(-90deg);
                        transition: transform 0.5s ease-in-out;
                    }
                }
                .left-panel-dashboard {
                    position: relative;
                    // left: -2.5px;
                    display: flex;
                    flex-direction: row;
                    justify-content: center;
                    align-items: center;
                    writing-mode: vertical-lr;
                    transform: rotate(180deg);
                    .arrow {
                        // padding-left: 15px;
                        fill: white;
                        // transform: rotate(-90deg);
                        transition: transform 0.5s ease-in-out;
                    }
                }
            }
            .grid3 {
                display: grid;
                grid-template-rows: 85px auto;
                .grid2-c2 {
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
                // .window-place {
                // }
            }
        }
    }
    .cursor-pointer {
        cursor: pointer;
    }
    .window-manage-dash {
        height: 100%;
        width: 100%;
        border: 0px solid $background;
    }
</style>