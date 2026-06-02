<script lang="ts">
    import type { BlockComponentProps } from "../BlockComponent";
    import RichText from "../../../richtext/RichText.svelte";
    import { TextBlockData } from "./TextBlockData";
    import { getActiveTextNode } from "$lib/util/getActiveTextNode";
    import { getCaretPos } from "$lib/util/caret/getCaretPos";

    const { blockData, doc }: BlockComponentProps = $props();

    const text = $derived(blockData instanceof TextBlockData ? blockData.text : undefined);

    let richText: RichText | undefined = $state();

    let pendingUpdate: (() => void) | undefined = $state();

    $effect(() => {
        pendingUpdate?.();
        pendingUpdate = undefined;
    });

    let beforeCaretPos: number;
    let beforeText: string;
</script>

{#if $text !== undefined}
    <p
        contenteditable
        onbeforeinput={() => {
            beforeText = getActiveTextNode()?.textContent ?? "";

            const pos = getCaretPos();
            if (pos === null) throw new Error("Failed to get caret position");
            beforeCaretPos = pos;
        }}
        oninput={() => (pendingUpdate = richText?.generateNewRaw(beforeCaretPos, beforeText))}
    >
        <RichText bind:raw={$text} bind:this={richText} />
    </p>
{/if}
