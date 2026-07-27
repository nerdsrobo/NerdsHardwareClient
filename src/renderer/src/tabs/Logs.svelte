<script lang="ts">
    import type { APIs } from "../apis.svelte";


    function scrollDown() {
        if ( (document.querySelector("#mm")?.scrollHeight ?? 0) - (document.querySelector("#mm")?.scrollTop ?? 0) < 1000 ) {
            document.querySelector("#mm")?.scrollTo(0, document.querySelector("#mm")?.scrollHeight ?? 0);
        }
    }

    const props: { apis: APIs } = $props();
    const apis = props.apis;

    apis.loggerApi.records.sub(() => {scrollDown()})

</script>

<div class="m" id="mm">
    {#each apis.loggerApi.records.state as log}
        {log}<br>
    {/each}
    <div class="down"></div>
</div>

<style lang="scss">
    $dark-one: #1E1E2A;
    .m {
        color: white;
        height: calc(100vh - 24px - 85px);
        overflow: overlay;
        scrollbar-color: black;
        background-color: #000000;
        line-height: 1.4;
        .down {
            height: 22px;
        }
    }
    ::-webkit-scrollbar {
        width: 10px;
        height: 10px;
    }
    ::-webkit-scrollbar-thumb {
    background: $dark-one;
    border-radius: 10px;
    }
    ::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.2);
    }
</style>