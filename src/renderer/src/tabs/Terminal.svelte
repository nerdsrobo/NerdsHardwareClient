<script lang="ts">
    import type { APIs } from "../apis.svelte";


    function scrollDown() {
        // if ( document.querySelector("#mm").scrollHeight - document.querySelector("#mm").scrollTop < 1000 ) {
            document.querySelector("#mm")?.scrollTo(0, document.querySelector("#mm")?.scrollHeight ?? 0);
            //.scrollBy({top: document.querySelector("#mm").scrollHeight - document.querySelector("#mm").scrollTop, behavior: "smooth"})
        // }
    }

    let props: { apis: APIs } = $props();
    let apis = props.apis;

    // apis.terminalApi.records.sub(() => {console.log("scroll"); scrollDown()})

    $effect(() => {
        apis.terminalApi.records.state;
        scrollDown();
    })

    let input = $state("");

    function checkSpecialInput(stdin: string) {
        if ( stdin == "" ) { return false; }
        if ( stdin.startsWith("clear") ) { apis.terminalApi.clear(); input = ""; return false; }
        return true;
    }

</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="m" id="mm" onclick={() => {document.getElementById("input")?.focus()}}>
    {#each apis.terminalApi.records.state as record}
        <div style="color: #ffffff">>>> {record.stdin}</div>
        <div style={"color: " + (record.isErr ? "#e92020" : "#ffffff") + "; padding-down: 10px"}>
            {#each record.stdout.split("\n") as line}
                {line}<br>
            {/each}
        </div>
    {/each}
    >>> <input type="text" spellcheck="false" bind:value={input} id="input" onkeydown={(e) => {if ( e.key == "Enter" ) { if ( checkSpecialInput(input) ) { apis.loggerApi.verbose("terminal cmd sent: " + input); apis.terminalApi.execute(input); input = ""; scrollDown() }} }}>
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