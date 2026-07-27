<script lang="ts">
    import { StateString } from "../../../common/types";
    import type { APIs } from "../apis.svelte";
    import { Tab } from "../tabsManager.svelte";

    const props: { apis: APIs } = $props();
    const apis = props.apis;

    const stateString: string = $derived.by(() => {
        switch ( apis.stateApi.state ) {
            case StateString.Idle:
            case StateString.Disabled:
                return "Idle";
            case StateString.Detected:
                return "Detected";
            case StateString.Connecting:
                return "Connecting...";
            case StateString.Connected:
                return "Connected";
            case StateString.Disconnected:
                return "Disconnected";
            case StateString.Error:
                return "Error";
            case StateString.NetworkChanged:
                return "Network changed"
            case StateString.NetworkNotFound:
                return "Network not found"
        }
        return "Idle"
    })

    const terminalTab = new Tab(() => window.innerHeight, "terminal", false);
    const logsTab = new Tab(() => window.innerHeight, "logs", false);

    const terminalArrowAngle = $derived(terminalTab.openingOrOpen ? 180 : 0);
    const logsArrowAngle = $derived(logsTab.openingOrOpen ? 180 : 0);

</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<div class="bottom-panel">
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="bottom-panel-state-terminal cursor-pointer" onclick={() => {terminalTab.handleClick()}}>
        <div class="state">{stateString}</div>
        <div class="terminal">
            <svg style={"transform: rotate(" + terminalArrowAngle + "deg);"} class="arrow" viewBox="0 0 24 20" width="13" height="13" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd"><path d="M11.574 3.712c.195-.323.662-.323.857 0l9.37 15.545c.2.333-.039.757-.429.757l-18.668-.006c-.385 0-.629-.422-.428-.758l9.298-15.538zm.429-2.483c-.76 0-1.521.37-1.966 1.111l-9.707 16.18c-.915 1.523.182 3.472 1.965 3.472h19.416c1.783 0 2.879-1.949 1.965-3.472l-9.707-16.18c-.446-.741-1.205-1.111-1.966-1.111z"/></svg>
            <div class="text">Terminal</div>
            <!-- <svg class="icon1" viewBox="0 0 24 24" width="18" height="18" clip-rule="evenodd" fill-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2" xmlns="http://www.w3.org/2000/svg"><path d="m21 4c0-.478-.379-1-1-1h-16c-.62 0-1 .519-1 1v16c0 .621.52 1 1 1h16c.478 0 1-.379 1-1zm-16.5.5h15v15h-15zm2.818 5.865 2.635 1.622-2.641 1.645c-.207.146-.318.378-.318.613 0 .601.682.966 1.182.613l3.511-2.257c.199-.141.318-.369.318-.614 0-.244-.119-.472-.318-.613l-3.505-2.235c-.498-.35-1.182.009-1.182.612 0 .236.111.468.318.614zm9.678 3.873c0-.414-.336-.75-.75-.75h-3.5c-.413 0-.75.336-.75.75s.337.75.75.75h3.5c.414 0 .75-.336.75-.75z" fill-rule="nonzero"/></svg> -->
        </div>
    </div>
    <div class="bottom-panel-line panel-line"></div>
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="bottom-panel-logs cursor-pointer" onclick={() => {logsTab.handleClick()}}>
        <svg style={"transform: rotate(" + logsArrowAngle + "deg);"} class="arrow" viewBox="0 0 24 20" width="13" height="13" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd"><path d="M11.574 3.712c.195-.323.662-.323.857 0l9.37 15.545c.2.333-.039.757-.429.757l-18.668-.006c-.385 0-.629-.422-.428-.758l9.298-15.538zm.429-2.483c-.76 0-1.521.37-1.966 1.111l-9.707 16.18c-.915 1.523.182 3.472 1.965 3.472h19.416c1.783 0 2.879-1.949 1.965-3.472l-9.707-16.18c-.446-.741-1.205-1.111-1.966-1.111z"/></svg>
        <div class="text">Logs</div>
        <!-- <svg class="icon1" viewBox="0 0 24 24" width="14" height="14" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd"><path d="M0 12l11 3.1 7-8.1-8.156 5.672-4.312-1.202 15.362-7.68-3.974 14.57-3.75-3.339-2.17 2.925v-.769l-2-.56v7.383l4.473-6.031 4.527 4.031 6-22z"/></svg> -->
    </div>
</div>

<style lang="scss">
    $dark-one: #1E1E2A;
    $dark-two: #28283D;
    $background: #080809;
    $on-color: #28691B;
    $sub-text: #BDBDBD;
    .panel-line {
        background-color: white;
    }
    .cursor-pointer {
        cursor: pointer;
    }
    .bottom-panel {
        z-index: 5;
        background-color: $dark-one;
        color: white;
        display: grid;
        grid-template-columns: 4fr 1px 1fr;
        font-size: 16px;
        .bottom-panel-state-terminal {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            .state {
                position: relative;
                top: -1px;
                padding-left: 10px;
            }
            .terminal {
                position: relative;
                top: -1px;
                display: flex;
                justify-content: end;
                align-items: center;
                padding-right: 25px;
                .arrow {
                    fill: white;
                    transition: transform 0.5s ease-in-out;
                }
                .text {
                    padding-left: 7px;
                }
                // .icon1 {
                //     padding-left: 8px;
                //     fill: white;
                // }
            }
        }
        .bottom-panel-logs {
            display: flex;
            flex-direction: row;
            justify-content: start;
            align-items: center;
            position: relative;
            top: -1px;
            padding-left: 25px;
            .arrow {
                fill: white;
                transition: transform 0.5s ease-in-out;
            }
            .text {
                padding-left: 7px;
            }
            // .icon1 {
            //     padding-left: 8px;
            //     fill: white;
            // }
        }
    }
</style>