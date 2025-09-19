<script lang="ts">

    import type { TerminalRecord } from "../../../main/terminalApi";

    function scrollDown() {
        if ( document.querySelector("#mm").scrollHeight - document.querySelector("#mm").scrollTop < 1000 ) {
            document.querySelector("#mm")
            //.scrollTo(0, document.querySelector("#mm").clientHeight+1);
            .scrollBy({top: 9999999999999999999999999999999999999, behavior: "smooth"})
        }
    }

    function recordsUpdateHandler(terminalRecord: TerminalRecord) {
        if ( terminalRecord.isUser && isExecSubmitted ) { input = ""; isExecSubmitted = false; }
        records.push(terminalRecord);
        scrollDown();
    }

    function beforeHandler(terminalRecords: Array<TerminalRecord>) {
        records = terminalRecords.concat(records);
        scrollDown();
    }

    const props: {
        terminalApi: {load: (callback) => void, setRecordUpdateHandler: (callback) => void, exec: (stdin: string) => void}
    } = $props();

    props.terminalApi.load(beforeHandler);
    props.terminalApi.setRecordUpdateHandler(recordsUpdateHandler);

    let records: Array<TerminalRecord> = $state([]);

    let input = $state("");

    let isExecSubmitted = $state(false);

    function checkSpecialInput(stdin: string) {
        if ( stdin == "" ) { return false; }
        if ( stdin.startsWith("clear") ) { records = []; input = ""; return false; }
        return true;
    }

</script>


<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="m" id="mm" onclick={() => {document.getElementById("input").focus()}}>
    {#each records as record}
        <div style="color: #ffffff">>>> {record.stdin}</div>
        <div style={"color: " + (record.isErr ? "#e92020" : "#ffffff") + "; padding-down: 10px"}>{record.stdout}</div>
    {/each}
    >>> <input type="text" spellcheck="false" bind:value={input} id="input" onkeydown={(e) => {if ( e.key == "Enter" && !isExecSubmitted ) { if ( checkSpecialInput(input) ) { isExecSubmitted = true; props.terminalApi.exec(input); scrollDown() }} }}>
    <br>
    {isExecSubmitted ? "..." : ""}
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
        input {
            font-family: 'Ubuntu', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            font-size: 16px;
            color: white;
            background: transparent;
            border: none;
            width: 90%;
            outline: none;
            padding: 0px;
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