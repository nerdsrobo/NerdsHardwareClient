<script lang="ts">
    import { OpModeStatus } from "../../../common/dashboardTypes";
    import type { APIs } from "../apis.svelte";
    import BigButton from "../components/BigButton.svelte";
    import Button from "../components/Button.svelte";
    import Dropdown from "../components/Dropdown.svelte";
    import { tabsManager } from "../tabsManager.svelte";

    const props: { apis: APIs } = $props();
    const apis = props.apis;

    function handleKeyEvent(keyCode: number, isPressed: boolean) {
        if ( !Object.values(apis.settingsApi.settings.keyboardGamepadEmulatorMapping).includes(keyCode) ) { return; }
        let updated = false;
        Object.values(apis.settingsApi.settings.keyboardGamepadEmulatorMapping).forEach((mappingKeyCode, i) => {
            if ( keyCode != mappingKeyCode ) { return }
            updated = true;
            const emulate = Object.keys(apis.settingsApi.settings.keyboardGamepadEmulatorMapping)[i];
            switch ( emulate ) {
                case "left_stick_x_positive":
                    apis.ftcDashboardApi.keyboardGamepadEmulatorGamepadState.left_stick_x = isPressed ? 1 : 0;
                    break;
                case "left_stick_x_positive_half":
                    apis.ftcDashboardApi.keyboardGamepadEmulatorGamepadState.left_stick_x = isPressed ? .5 : 0;
                    break;
                case "left_stick_x_negative":
                    apis.ftcDashboardApi.keyboardGamepadEmulatorGamepadState.left_stick_x = isPressed ? -1 : 0;
                    break;
                case "left_stick_x_negative_half":
                    apis.ftcDashboardApi.keyboardGamepadEmulatorGamepadState.left_stick_x = isPressed ? -.5 : 0;
                    break;
                case "left_stick_y_positive":
                    apis.ftcDashboardApi.keyboardGamepadEmulatorGamepadState.left_stick_y = isPressed ? 1 : 0;
                    break;
                case "left_stick_y_positive_half":
                    apis.ftcDashboardApi.keyboardGamepadEmulatorGamepadState.left_stick_y = isPressed ? .5 : 0;
                    break;
                case "left_stick_y_negative":
                    apis.ftcDashboardApi.keyboardGamepadEmulatorGamepadState.left_stick_y = isPressed ? -1 : 0;
                    break;
                case "left_stick_y_negative_half":
                    apis.ftcDashboardApi.keyboardGamepadEmulatorGamepadState.left_stick_y = isPressed ? -.5 : 0;
                    break;
                case "right_stick_x_positive":
                    apis.ftcDashboardApi.keyboardGamepadEmulatorGamepadState.right_stick_x = isPressed ? 1 : 0;
                    break;
                case "right_stick_x_positive_half":
                    apis.ftcDashboardApi.keyboardGamepadEmulatorGamepadState.right_stick_x = isPressed ? .5 : 0;
                    break;
                case "right_stick_x_negative":
                    apis.ftcDashboardApi.keyboardGamepadEmulatorGamepadState.right_stick_x = isPressed ? -1 : 0;
                    break;
                case "right_stick_x_negative_half":
                    apis.ftcDashboardApi.keyboardGamepadEmulatorGamepadState.right_stick_x = isPressed ? -.5 : 0;
                    break;
                case "right_stick_y_positive":
                    apis.ftcDashboardApi.keyboardGamepadEmulatorGamepadState.right_stick_y = isPressed ? 1 : 0;
                    break;
                case "right_stick_y_positive_half":
                    apis.ftcDashboardApi.keyboardGamepadEmulatorGamepadState.right_stick_y = isPressed ? .5 : 0;
                    break;
                case "right_stick_y_negative":
                    apis.ftcDashboardApi.keyboardGamepadEmulatorGamepadState.right_stick_y = isPressed ? -1 : 0;
                    break;
                case "right_stick_y_negative_half":
                    apis.ftcDashboardApi.keyboardGamepadEmulatorGamepadState.right_stick_y = isPressed ? -.5 : 0;
                    break;
                case "left_trigger":
                case "right_trigger":
                    apis.ftcDashboardApi.keyboardGamepadEmulatorGamepadState[emulate] = isPressed ? 1 : 0;
                    break;
                default:
                    apis.ftcDashboardApi.keyboardGamepadEmulatorGamepadState[emulate] = isPressed;
                    break;
            }
        })
        if ( updated ) { apis.ftcDashboardApi.gamepadsUpdated(apis.ftcDashboardApi.gamepadService.gamepads.state) }
    }

</script>

<div class="m">
    <div class="opMode">
        <span style:font-size={"16px"}>
        {#if apis.ftcDashboardApi.isWsOpened}
            <b>{apis.ftcDashboardApi.robotStatus.pingMs}ms / {apis.ftcDashboardApi.robotStatus.batteryVoltage.toFixed(2)}V</b><br>
            {#if apis.ftcDashboardApi.robotStatus.warningMessage}
                <b style:color="yellow">{apis.ftcDashboardApi.robotStatus.warningMessage}</b><br>
            {/if}
            {#if apis.ftcDashboardApi.robotStatus.errorMessage}
                <b style:color="red">{apis.ftcDashboardApi.robotStatus.errorMessage}</b><br>
            {/if}
        {:else}
            <b>FTC Dashboard disconnected</b>
        {/if}
        </span>
        {#if apis.ftcDashboardApi.robotStatus.activeOpModeStatus == OpModeStatus.STOPPED && apis.ftcDashboardApi.opModeList.length == 0 }
            <div><b>No opModes loaded</b></div>
        {/if}
        {#if apis.ftcDashboardApi.robotStatus.activeOpModeStatus != OpModeStatus.STOPPED && apis.ftcDashboardApi.isWsOpened }
            <div><b>
                {apis.ftcDashboardApi.robotStatus.activeOpMode}
            </b></div>
        {/if}
        {#if apis.ftcDashboardApi.robotStatus.activeOpModeStatus == OpModeStatus.STOPPED && apis.ftcDashboardApi.opModeList.length > 0 }
            <Dropdown items={apis.ftcDashboardApi.opModeList} bind:selectedIndex={apis.ftcDashboardApi.selectedOpModeIndex} notSelectedText={"- Choose OpMode -"} dropdownHeight={"300px"}/>
            {#if apis.ftcDashboardApi.selectedOpModeIndex > -1 && apis.ftcDashboardApi.isWsOpened }
                <!-- svelte-ignore a11y_click_events_have_key_events -->
                <!-- svelte-ignore a11y_no_static_element_interactions -->
                <div onclick={() => {apis.ftcDashboardApi.initOpMode()}} class="cursor-pointer"><BigButton text = {"Init"} color_ = {"#00a2e8"} /></div>
            {/if}
        {/if}
        {#if apis.ftcDashboardApi.robotStatus.activeOpModeStatus == OpModeStatus.INIT && apis.ftcDashboardApi.isWsOpened }
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div onclick={() => {apis.ftcDashboardApi.startOpMode()}} class="cursor-pointer"><BigButton text={"Start"} color_={"#28691B"} /></div>
        {/if}
        {#if (apis.ftcDashboardApi.robotStatus.activeOpModeStatus == OpModeStatus.RUNNING || apis.ftcDashboardApi.robotStatus.activeOpModeStatus == OpModeStatus.INIT) && apis.ftcDashboardApi.isWsOpened }
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div onclick={() => {apis.ftcDashboardApi.stopOpMode()}} class="cursor-pointer"><BigButton text={"Stop"} color_={"#6b1a1a"} /></div>
        {/if}
    </div>
    <div class="gamepads">
        <Button text={"Clear Users"} onclick={() => {apis.ftcDashboardApi.gamepad1Index=-1; apis.ftcDashboardApi.gamepad2Index=-1}} />
        <div class="gamepad">
            <i class="gamepad-name">Keyboard emulator</i>
            <Button text={"Change Mapping"} onclick={() => {tabsManager.tabs.changeKeyboardGamepadEmulatorMapping?.open()}} />
            <div class="buttons">
                <div class="button" style:border={`${apis.ftcDashboardApi.gamepad1Index == -2 ? "#28691B" : "#4b4b4b"} 2px solid`}>
                    <Button text={"User 1"} onclick={() => {apis.ftcDashboardApi.gamepad1Index=-2; if(apis.ftcDashboardApi.gamepad2Index==-2){apis.ftcDashboardApi.gamepad2Index=-1}}} />
                </div>
                <div class="button" style:border={`${apis.ftcDashboardApi.gamepad2Index == -2 ? "#28691B" : "#4b4b4b"} 2px solid`}>
                    <Button text={"User 2"} onclick={() => {apis.ftcDashboardApi.gamepad2Index=-2; if(apis.ftcDashboardApi.gamepad1Index==-2){apis.ftcDashboardApi.gamepad1Index=-1}}} />
                </div>
            </div>
        </div>
        {#each apis.ftcDashboardApi.gamepadService.gamepadsIds as gamepadId, i}
            {#if gamepadId}
                <div class="gamepad">
                    <i class="gamepad-name">{gamepadId.replace(/.(?<=\(\S* )[^)]*/, "")}</i>
                    <div class="buttons">
                        <div class="button" style:border={`${apis.ftcDashboardApi.gamepad1Index == i ? "#28691B" : "#4b4b4b"} 2px solid`}>
                            <Button text={"User 1"} onclick={() => {apis.ftcDashboardApi.gamepad1Index=i; if(apis.ftcDashboardApi.gamepad2Index==i){apis.ftcDashboardApi.gamepad2Index=-1}}} />
                        </div>
                        <div class="button" style:border={`${apis.ftcDashboardApi.gamepad2Index == i ? "#28691B" : "#4b4b4b"} 2px solid`}>
                            <Button text={"User 2"} onclick={() => {apis.ftcDashboardApi.gamepad2Index=i; if(apis.ftcDashboardApi.gamepad1Index==i){apis.ftcDashboardApi.gamepad1Index=-1}}} />
                        </div>
                    </div>
                </div>
            {/if}
        {/each}
    </div>
</div>

<svelte:window onkeydown={ev => handleKeyEvent(ev.keyCode, true)} onkeyup={ev => handleKeyEvent(ev.keyCode, false)} />

<style lang="scss">
    $dark-one: #1E1E2A;
    $dark-two: #28283D;
    $background: #080809;
    $on-color: #28691B;
    $sub-text: #BDBDBD;
    .m {
        width: 100%;
        height: 100%;
        color: white;
        display: flex;
        justify-content: space-between;
        align-items: start;
        .opMode {
            display: flex;
            flex-direction: column;
            justify-content: start;
            align-items: start;
            font-size: 24px;
            padding-left: 15px;
            padding-top: 15px;
            gap: 5px;
        }
        .gamepads {
            display: flex;
            flex-direction: column;
            justify-content: start;
            align-items: center;
            gap: 5px;
            padding-right: 15px;
            padding-top: 15px;
            .gamepad {
                background-color: $dark-one;
                border-radius: 7px;
                padding: 5px;
                display: flex;
                flex-direction: column;
                gap: 5px;
                .buttons {
                    display: flex;
                    justify-content: space-evenly;
                    .button {
                        border-radius: 7px;
                    }
                }
            }
            .gamepad-name {
                font-size: 10pt;
            }
        }
    }
    .cursor-pointer {
        cursor: pointer;
    }
</style>