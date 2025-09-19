<script lang="ts">
    import Setting from "../components/Setting.svelte";

    const props: { goto: Function, modifySetting: Function, firstLoaded: any } = $props();

    function modifySetting(settingName: string, newval: boolean) {
        props.modifySetting(settingName, newval);
    }

</script>

<div class="m">
    <div class="upper">
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div class="arrow-container cursor-pointer" onclick={() => props.goto("main")}>
            <svg class="arrow" viewBox="0 0 24 20" width="32" height="32" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd"><path d="M11.574 3.712c.195-.323.662-.323.857 0l9.37 15.545c.2.333-.039.757-.429.757l-18.668-.006c-.385 0-.629-.422-.428-.758l9.298-15.538zm.429-2.483c-.76 0-1.521.37-1.966 1.111l-9.707 16.18c-.915 1.523.182 3.472 1.965 3.472h19.416c1.783 0 2.879-1.949 1.965-3.472l-9.707-16.18c-.446-.741-1.205-1.111-1.966-1.111z"/></svg>
        </div>
        <div class="title">Settings</div>
    </div>
    <div class="settings-area">
        <div class="left"></div>
        <div class="setting-s">
            <Setting modify={e => modifySetting("autodetect", e)} label="Auto-detection" subtextOn="The app will try to find the Control Hub and/or FTC Dashboard on the network" subtextOff="The app will not try to find the Control Hub and/or FTC Dashboard on the network" isToggled={props.firstLoaded.autodetect.enabled}></Setting>
            <Setting modify={e => modifySetting("autodetect_rc", e)} label='Auto-detection only on "*-RC"' subtextOn='Auto-detection feature will only work on Wi-Fi networks with the "*-RC" pattern in name' subtextOff="Auto-detection feature will work with all Wi-Fi networks" isToggled={props.firstLoaded.autodetect_rc.enabled}></Setting>
            <Setting modify={e => modifySetting("autodetect_ch", e)} label='Auto-detect the Control Hub' subtextOn='The app will make requests to 192.168.43.1:8080 to find the Control Hub' subtextOff="The app will not search for the Control Hub" isToggled={props.firstLoaded.autodetect_ch.enabled}></Setting>
            <Setting modify={e => modifySetting("autodetect_dash", e)} label='Auto-detect the FTC Dashboard' subtextOn='The app will make requests to 192.168.43.1:8080/dash to find the FTC Dashboard' subtextOff="The app will not search for the FTC Dashboard" isToggled={props.firstLoaded.autodetect_dash.enabled}></Setting>
            <Setting modify={e => modifySetting("display_dash", e)} label='Display "Dashboard" on the left bar' subtextOn='"Dashboard" will be displayed on the left bar' subtextOff='"Dashboard" will not be displayed on the left bar' isToggled={props.firstLoaded.display_dash.enabled}></Setting>
            Software by team 31900 Nerds Ignore Napless<br>
            Not affiliated with REV Robotics or other hardwares vendors
        </div>
        <div class="right"></div>
    </div>
    
</div>

<style lang="scss">
    .m {
        color: white;
        .upper {
            height: 75px;
            display: grid;
            grid-template-columns: auto 1fr;
            .arrow-container {
                display: flex;
                justify-content: start;
                align-items: center;
                .arrow {
                    fill: white;
                    transform: rotate(-90deg);
                }
                padding-right: 10px;
                padding-left: 10px;
            }
            
            .title {
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 22px;
            }
        }
        .settings-area {
            display: grid;
            grid-template-columns: 1fr 5fr 1fr;
            .setting-s {
                display: flex;
                flex-direction: column;
                gap: 20px;
            }
        }
        
    }
    .cursor-pointer {
        cursor: pointer;
    }
</style>