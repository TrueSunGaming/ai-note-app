<script lang="ts">
    import "$lib/style/fonts.scss";
    import "$lib/style/colors.scss";
    import "$lib/style/global.scss";
    import "$lib/style/classes.scss";
    import { onMount } from "svelte";
    import { rawPaste } from "$lib/util/rawPaste";

    const { children } = $props();

    onMount(() => {
        document.addEventListener("paste", rawPaste);
    });
</script>

<main>
    {@render children()}
</main>
