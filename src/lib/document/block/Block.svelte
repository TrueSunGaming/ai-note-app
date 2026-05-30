<script lang="ts">
    import type { BlockComponentProps } from "./BlockComponent";
    import { BlockData } from "./BlockData";

    const { blockData }: BlockComponentProps = $props();
    const BlockComponent = $derived(BlockData.registry.get(blockData.type)?.[1]);
</script>

<BlockComponent {blockData} />
