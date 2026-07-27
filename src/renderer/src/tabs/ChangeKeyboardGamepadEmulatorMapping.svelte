<script lang="ts">
    import type { APIs } from "../apis.svelte";
    import BigButton from "../components/BigButton.svelte";
    import KeyboardGamepadEmulatorMap from "../components/KeyboardGamepadEmulatorMap.svelte";
    import { tabsManager } from "../tabsManager.svelte";

    const props: { apis: APIs } = $props();
    const apis = props.apis;

    function cancelSettingsUpdate() {
        tabsManager.opened?.hide();
    }
    function updateSettings() {
        apis.settingsApi.updateSetting("keyboardGamepadEmulatorMapping", $state.snapshot(keyboardMapping));
        tabsManager.opened?.hide();
    }

    let keySubbers: Set<(keyCode: number) => void> = $state(new Set());

    function handleKeyEvent(keyCode: number) {
        keySubbers.forEach(subber => subber(keyCode));
    }

    const keyboardMapping = $state($state.snapshot(apis.settingsApi.settings).keyboardGamepadEmulatorMapping);

    const mappingNamesAndBinds = $state({
        "Left Stick X to 1": "left_stick_x_positive",
        "Left Stick X to -1": "left_stick_x_negative",
        "Left Stick Y to 1": "left_stick_y_positive",
        "Left Stick Y to -1": "left_stick_y_negative",
        "Left Stick X to 0.5": "left_stick_x_positive_half",
        "Left Stick X to -0.5": "left_stick_x_negative_half",
        "Left Stick Y to 0.5": "left_stick_y_positive_half",
        "Left Stick Y to -0.5": "left_stick_y_negative_half",
        "Right Stick X to 1": "right_stick_x_positive",
        "Right Stick X to -1": "right_stick_x_negative",
        "Right Stick Y to 1": "right_stick_y_positive",
        "Right Stick Y to -1": "right_stick_y_negative",
        "Right Stick X to 0.5": "right_stick_x_positive_half",
        "Right Stick X to -0.5": "right_stick_x_negative_half",
        "Right Stick Y to 0.5": "right_stick_y_positive_half",
        "Right Stick Y to -0.5": "right_stick_y_negative_half",
        "Button Dpad Up": "dpad_up",
        "Button Dpad Down": "dpad_down",
        "Button Dpad Left": "dpad_left",
        "Button Dpad Right": "dpad_right",
        "Button A / Cross": "a",
        "Button B / Circle": "b",
        "Button X / Square": "x",
        "Button Y / Triangle": "y",
        "Button Guide": "guide",
        "Button Start / Options": "start",
        "Button Back / Share": "back",
        "Button Left Bumper": "left_bumper",
        "Button Right Bumper": "right_bumper",
        "Left Stick Button": "left_stick_button",
        "Right Stick Button": "right_stick_button",
        "Left Trigger to 1": "left_trigger",
        "Right Trigger to 1": "right_trigger"
    })

</script>

<div class="m">
    <div class="mappings" style:height={"calc(100vh - 24px - 85px)"}>
        {#each Object.keys(mappingNamesAndBinds) as eventName}
            <div><KeyboardGamepadEmulatorMap gamepadEventName={eventName} bind:keyCodeBind={keyboardMapping[mappingNamesAndBinds[eventName]]} subToKeyEvent={(f: (keyCode: number) => void) => keySubbers.add(f)} /></div>
        {/each}
    </div>
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <div class="buttons">
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div onclick={() => {cancelSettingsUpdate()}}><BigButton text={"Cancel"} color_={"#e49c36"} /></div>
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div onclick={() => {updateSettings()}}><BigButton text={"OK"} color_={"#28691B"} /></div>
    </div>    
</div>

<svelte:window onkeydown={ev => handleKeyEvent(ev.keyCode)} />

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
        gap: 30px;
        .mappings {
            overflow: overlay;
            box-sizing: border-box;
            padding: 15px;
            display: flex;
            flex-direction: column;
            align-items: start;
            gap: 5px;
            padding-left: 15px;
            font-size: 18px;
        }
        .buttons {
            display: flex;
            flex-direction: column;
            gap: 30px;
        }
    }
    ::-webkit-scrollbar {
        width: 10px;
        height: 10px;
    }
    ::-webkit-scrollbar-thumb {
        background: $dark-two;
        border-radius: 10px;
    }
    ::-webkit-scrollbar-track {
        background: rgba(0, 0, 0, 0.2);
    }
    // .cursor-pointer {
    //     cursor: pointer;
    // }
    // path {
    //     fill: white; 
    // }
</style>