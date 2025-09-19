<script lang="ts">

    function scrollDown() {
        if ( document.querySelector("#mm").scrollHeight - document.querySelector("#mm").scrollTop < 1000 ) {
            document.querySelector("#mm")
            //.scrollTo(0, document.querySelector("#mm").clientHeight+1);
            .scrollBy({top: 9999999999999999999999999999999999999, behavior: "smooth"})
        }
    }

    function recordsUpdateHandler(log: string) {
        logs.push(log);
        scrollDown();
    }

    function beforeHandler(logs_: Array<string>) {
        logs = logs_.concat(logs);
        scrollDown();
    }

    const props: {
        logsConnectorApi: {load: (callback) => void, setRecordUpdateHandler: (callback) => void}
    } = $props();

    props.logsConnectorApi.load(beforeHandler);
    props.logsConnectorApi.setRecordUpdateHandler(recordsUpdateHandler);

    let logs: Array<string> = $state([]);

</script>

<div class="m" id="mm">
    {#each logs as log}
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