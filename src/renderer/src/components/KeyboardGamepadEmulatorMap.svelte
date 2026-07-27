<script lang="ts">
    import Button from "./Button.svelte";


    const keyCodeMap: Record<number, string> = {
        8: 'Backspace',
        9: 'Tab',
        13: 'Enter',
        16: 'Shift',
        17: 'Control',
        18: 'Alt',
        19: 'Pause Break',
        20: 'Caps Lock',
        27: 'Escape',
        32: 'Space',
        37: 'Arrow Left',
        38: 'Arrow Up',
        39: 'Arrow Right',
        40: 'Arrow Down',
        33: 'Page Up',
        34: 'Page Down',
        35: 'End',
        36: 'Home',
        45: 'Insert',
        46: 'Delete',
        91: 'Left Window Key',
        92: 'Right Window Key',
        93: 'SelectKey',
        96: 'Numpad 0', 97: 'Numpad 1', 98: 'Numpad 2', 99: 'Numpad 3', 100: 'Numpad 4', 101: 'Numpad 5', 102: 'Numpad 6', 103: 'Numpad 7', 104: 'Numpad 8', 105: 'Numpad 9',
        106: 'Multiply', 107: 'Add', 109: 'Subtract', 110: 'Decimal Point', 111: 'Divide',
        112: 'F1', 113: 'F2', 114: 'F3', 115: 'F4', 116: 'F5', 117: 'F6', 118: 'F7', 119: 'F8', 120: 'F9', 121: 'F10', 122: 'F11', 123: 'F12',
        144: 'Num Lock', 145: 'Scroll Lock',
        186: 'SemiColon', 187: 'Equals', 188: 'Comma', 189: 'Dash', 190: 'Dot', 191: 'Forward Slash', 192: 'Tilde', 219: '[', 220: 'Back Slash', 221: ']', 222: 'Quote',
        // For A-Z keys (65-90)
        ...Object.fromEntries(
            Array.from({ length: 26 }, (_, i) => [i + 65, String.fromCharCode(i + 65)])
        ),
        // For 0-9 keys (48-57)
        ...Object.fromEntries(
            Array.from({ length: 10 }, (_, i) => [i + 48, String(i)])
        )
    }; // да я взял из гугла и мне не стыдно (ну почти не пришлось копировать много строчек)

    let { gamepadEventName, keyCodeBind = $bindable(), subToKeyEvent }: { gamepadEventName: string, keyCodeBind: number, subToKeyEvent: Function } = $props();

    subToKeyEvent((keyCode: number) => {
        if ( !isListen ) { return; }
        keyCodeBind = keyCode;
        isListen = false;
    })

    let isListen = $state(false);

</script>

<div class="m">
    <b>{gamepadEventName}</b> <Button text={isListen ? "Listening to key..." : (keyCodeMap[keyCodeBind] || 'Unknown')} onclick={() => isListen = !isListen}/>
</div>

<style lang="scss">
    .m {
        display: flex;
        gap: 15px;
    }
</style>