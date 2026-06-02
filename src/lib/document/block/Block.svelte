<script lang="ts">
    import type { BlockComponentProps } from "./BlockComponent";
    import { BlockData } from "./BlockData";
    import { onMount } from "svelte";

    const { blockData, doc }: BlockComponentProps = $props();

    onMount(() => {
        if (doc.pendingSelection?.uuid != blockData.uuid) return;
        doc.pendingSelection.callback();
        doc.pendingSelection = null;
    });

    const BlockComponent = $derived(BlockData.registry.get(blockData.type)?.[1]);
</script>

<BlockComponent {blockData} {doc} />
