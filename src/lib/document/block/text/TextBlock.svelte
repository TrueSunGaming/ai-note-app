<script lang="ts">
    import type { BlockComponentProps } from "../BlockComponent";
    import { TextBlockData } from "./TextBlockData";

    const { blockData }: BlockComponentProps = $props();
    const text = $derived(blockData instanceof TextBlockData ? blockData.text : undefined);
</script>

{#if text}
    <p contenteditable bind:innerText={$text}></p>
{/if}
