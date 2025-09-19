<script lang="ts">
    const props: { text: string, color_: string } = $props();
</script>

<div class="m" style={"border: 5px solid " + props.color_ + ";"}>
    {props.text}
</div>

<style lang="scss">
    $dark-one: #1E1E2A;
    $dark-two: #28283D;
    $on-color: #28691B;
    .m {
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: $dark-one;
        border-radius: 15px;
        // border: 5px solid $on-color;
        outline: 5px solid $dark-one;
        color: white;
        padding: 15px;
        margin: 15px;
        font-size: 24px;
        transition: border 0.5s ease-in-out;
    }
</style>