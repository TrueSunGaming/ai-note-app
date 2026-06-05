<script lang="ts">
    import { BlockData } from "./block/BlockData";
    import type { DocumentData } from "./DocumentData";
    import { moveCaretToStart } from "$lib/util/caret/moveCaretToStart";
    import { tick } from "svelte";

    interface Props {
        doc: DocumentData;
        afterUUID?: string;
    }

    const { doc, afterUUID }: Props = $props();
    const { blocks: blocksStore } = $derived(doc);

    async function insert(): Promise<void> {
        const block = BlockData.fromRaw({
            type: "text",
            text: ""
        })!;

        if (afterUUID) {
            $blocksStore.splice($blocksStore.findIndex((b) => b.uuid == afterUUID) + 1, 0, block);
        } else {
            $blocksStore.push(block);
        }

        $blocksStore = $blocksStore;
        await tick();

        block.focus();
    }
</script>

<button aria-label="Insert new text block" onclick={insert}></button>

<style lang="scss">
    button {
        border: none;
        background-color: transparent;
        width: 100%;
        height: 100%;
        cursor: text;
    }
</style>
