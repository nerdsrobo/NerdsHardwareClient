<script lang="ts">
    import { tabsManager } from "../tabsManager.svelte";


    const props: {tabName: string, doesItPings: boolean, tabId: string} = $props();

</script>

<div class="m" style:transform={"translate(" + -tabsManager.tabs[props.tabId]?.spring.current + "px, 0)"} style:z-index={tabsManager.tabs[props.tabId]?.zOrder-1}>
    <b>{props.tabName} Tab</b>
    <div>Page is now loading...</div>
    {props.doesItPings ? '' : "It's doesn't pings, so probably it's will not load"}
</div>

<style lang="scss">
    $dark-one: #1E1E2A;
    $dark-two: #28283D;
    $background: #080809;
    $on-color: #28691B;
    $sub-text: #BDBDBD;
    .m {
        position: absolute;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 10px;
        background-color: $dark-one;
        color: white;
        font-size: 30px;
        width: calc(100vw - 24px);
        height: 100%;
    }
</style>