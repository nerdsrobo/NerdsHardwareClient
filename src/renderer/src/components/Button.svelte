<script lang="ts">

    const props: { text: string, onclick: () => void } = $props();

</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="m" onclick={() => {props.onclick()}}>
    {props.text}
</div>

<style lang="scss">
    $dark-one: #1E1E2A;
    $dark-two: #28283D;
    $background: #080809;
    $on-color: #28691B;
    $sub-text: #BDBDBD;
    .m {
        width: fit-content;
        background-color: $background;
        border-radius: 7px;
        border: #4b4b4b 1px solid;
        padding: 4px;
        cursor: pointer;
    }
</style>