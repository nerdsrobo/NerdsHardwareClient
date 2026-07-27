<script lang="ts">
    import { createApis } from "./apis.svelte";
    import Load from "./pages/Load.svelte";
    import Main from "./pages/Main.svelte"
    import Settings from "./pages/Settings.svelte";

    let currPage = $state("load");

    function goto(page: string) {
        apis.loggerApi.verbose("page set: " + page);
        currPage = page;
    }

    const apis = createApis();

    currPage = "main";

</script>

<div class="m">
    {#if currPage == "main"}
         <Main goto={goto} apis={apis}></Main>
    {:else if currPage == "settings"}
         <Settings goto={goto} apis={apis}></Settings>
    {:else if currPage == "load"}
         <Load></Load>
    {/if}
</div>

<style lang="scss">
    .m {
        height: 100%;
        width: 100%;
    }
</style>