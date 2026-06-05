<script lang="ts">
    import type { Action } from "svelte/action";
    import type { RichTextStructure } from "./RichTextStructure";

    interface Props {
        children: (string | RichTextStructure)[];
        index: number;
        idxPath: string;
    }

    const { children, index, idxPath }: Props = $props();
    const child = $derived(children[index]);

    const syncText: Action = (node) => {
        $effect(() => {
            node.innerText = child as string;
        });
    };
</script>

<span data-richtext-idx-path={idxPath} use:syncText></span>

<style lang="scss">
    span {
        white-space: pre;
    }
</style>
