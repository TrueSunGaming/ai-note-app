<script lang="ts">
    import type { BlockComponentProps } from "../BlockComponent";
    import RichText from "../../../richtext/RichText.svelte";
    import { TextBlockData } from "./TextBlockData";
    import { events } from "$lib/document/events/events.svelte";

    const { blockData, doc }: BlockComponentProps = $props();

    const text = $derived(blockData instanceof TextBlockData ? blockData.text : undefined);
</script>

{#if $text !== undefined}
    <p contenteditable data-uuid={blockData.uuid} use:events={doc}>
        <RichText bind:raw={$text} />
    </p>
{/if}
