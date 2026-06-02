<script lang="ts">
    import "./feature/loadFeatures";
    import { richTextToStructure, stringifyRichTextStructure } from "./RichTextStructure";
    import RichTextFeature from "./feature/RichTextFeature.svelte";
    import { findCharInStructure } from "./findCharInStructure";
    import { getActiveTextNode } from "$lib/util/getActiveTextNode";
    import { setCaretPos } from "$lib/util/caret/setCaretPos";
    import { untrack } from "svelte";

    interface Props {
        raw: string;
    }

    let { raw = $bindable() }: Props = $props();

    let cancelUpdates = 0;
    let renderingRaw = $state("");
    const structure = $derived(richTextToStructure(renderingRaw));

    $effect(() => {
        if (cancelUpdates > 0) {
            cancelUpdates--;
            return;
        }

        renderingRaw = raw;
    });

    export function generateNewRaw(caretPos: number): (() => void) | undefined {
        const caret = findCharInStructure(structure, caretPos);
        if (!caret) return;
        console.log(caret, caret[0].children[caret[1]]);

        const activeTextNode = getActiveTextNode();
        if (!activeTextNode) return;

        // svelte-check thinks this is string | null but its just string
        caret[0].children[caret[1]] = activeTextNode.textContent!;

        cancelUpdates++;
        raw = stringifyRichTextStructure(structure);
    }
</script>

<RichTextFeature tag={structure.tag} bind:children={structure.children} />
