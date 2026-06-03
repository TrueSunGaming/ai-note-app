<script lang="ts">
    import type { BlockComponentProps } from "../BlockComponent";
    import RichText from "../../../richtext/RichText.svelte";
    import { TextBlockData } from "./TextBlockData";
    import { events } from "$lib/document/events/events.svelte";
    import { getActiveTextNode } from "$lib/util/getActiveTextNode";

    const { blockData, doc }: BlockComponentProps = $props();

    const text = $derived(blockData instanceof TextBlockData ? blockData.text : undefined);

    let richText: RichText | undefined = $state();

    let activeBefore: Text | null = null;
</script>

{#if $text !== undefined}
    <p
        contenteditable
        onbeforeinput={() => {
            // const pos = getCaretPos();
            // if (pos === null) throw new Error("Failed to get caret position");
            // beforeCaretPos = pos;

            activeBefore = getActiveTextNode();
        }}
        oninput={() => richText?.generateNewRaw(activeBefore)}
        data-uuid={blockData.uuid}
        use:events={doc}
    >
        <RichText bind:raw={$text} bind:this={richText} />
    </p>
{/if}
