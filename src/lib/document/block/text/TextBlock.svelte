<script lang="ts">
    import type { BlockComponentProps } from "../BlockComponent";
    import RichText from "../../../richtext/RichText.svelte";
    import { TextBlockData } from "./TextBlockData";
    import { getCaretPos } from "$lib/util/caret/getCaretPos";

    const { blockData }: BlockComponentProps = $props();

    const text = $derived(blockData instanceof TextBlockData ? blockData.text : undefined);

    let richText: RichText | undefined = $state();

    let beforeCaretPos: number;
</script>

{#if $text !== undefined}
    <p
        contenteditable
        onbeforeinput={() => {
            const pos = getCaretPos();
            if (pos === null) throw new Error("Failed to get caret position");
            beforeCaretPos = pos;
        }}
        oninput={() => richText?.generateNewRaw(beforeCaretPos)}
    >
        <RichText bind:raw={$text} bind:this={richText} />
    </p>
{/if}
