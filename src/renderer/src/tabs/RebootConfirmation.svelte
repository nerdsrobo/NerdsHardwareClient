<script lang="ts">
    import type { APIs } from "../apis.svelte";
    import BigButton from "../components/BigButton.svelte";
    import { tabsManager } from "../tabsManager.svelte";

    const props: { apis: APIs } = $props();
    const apis = props.apis;

</script>

<div class="m">
    <b>Are you sure wanna reboot Hub?</b>
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <div class="buttons">
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div onclick={() => {tabsManager.tabs.manage?.open()}}><BigButton text={"Cancel"} color_={"#e49c36"} /></div>
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div onclick={() => {tabsManager.tabs.rebootConfirmation?.hide(); apis.manageApiApi.requestReboot()}}><BigButton text={"OK"} color_={"#28691B"}/></div> 
    </div>
</div>

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
        background-color: $dark-one;
        border-radius: 25px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        .buttons {
            display: flex;
            gap: 30px;
        }
    }
</style>