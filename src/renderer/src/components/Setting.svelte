<script lang="ts">
    import Toggle from "svelte-toggle";

    let props: { modify: Function, label: string, subtextOn: string, subtextOff: string, isToggled: boolean } = $props();

    let bindedValue = $state(props.isToggled);

</script>

<div class="m">
    <Toggle on:toggle={e => (props.modify(e.detail))} bind:toggled={bindedValue} hideLabel={true} toggledColor="#28691B" untoggledColor="#28283D"><div class="inner">{props.label}</div></Toggle>
    <div class="subtext">
        {bindedValue ? props.subtextOn : props.subtextOff}
    </div>
</div>

<style lang="scss">
    $dark-one: #1E1E2A;
    $dark-two: #28283D;
    $background: #080809;
    $on-color: #28691B;
    $sub-text: #BDBDBD;
    .inner {
        padding-left: 15px;
        font-size: 16px
    }
    .subtext {
        color: $sub-text;
        font-size: 16px;
    }
</style>