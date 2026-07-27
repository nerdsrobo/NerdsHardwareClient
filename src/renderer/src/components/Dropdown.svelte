<script lang="ts">
    import Button from "./Button.svelte";

    let { items, selectedIndex = $bindable(), notSelectedText, dropdownHeight }: { items: Array<string>, selectedIndex: number, notSelectedText: string, dropdownHeight: string } = $props();
    
    let isMenuOpened = $state(false);

    function handleDropdownMenuClick() {
        isMenuOpened = !isMenuOpened;
    }
</script>

<div class="m">
    <Button text={selectedIndex == -1 ? notSelectedText : items[selectedIndex]} onclick={() => handleDropdownMenuClick()} />
    {#if isMenuOpened}
        <div class="menu" style:height={dropdownHeight}>
            {#each items as item, i}
                <!-- svelte-ignore a11y_click_events_have_key_events -->
                <!-- svelte-ignore a11y_no_static_element_interactions -->
                <div class={`item ${selectedIndex == i ? "selected-item" : ""}`} onclick={() => {selectedIndex = i; isMenuOpened = false;}}>
                    {item}
                </div>
            {/each}
        </div>
    {/if}
</div>

<style lang="scss">
    $dark-one: #1E1E2A;
    $dark-two: #28283D;
    $background: #080809;
    $on-color: #28691B;
    $sub-text: #BDBDBD;
    .m {
        .menu {
            position: absolute;
            overflow: overlay;
            border-radius: 7px;
            .item {
                width: 100%;
                background-color: $dark-one;
                color: white;
                padding: 6px;
                box-sizing: border-box;
                cursor: pointer;
            }
            .selected-item {
                background-color: $dark-two;
            }
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
</style>