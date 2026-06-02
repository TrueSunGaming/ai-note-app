<script lang="ts">
    import "./feature/loadFeatures";
    import { richTextToStructure, stringifyRichTextStructure } from "./RichTextStructure";
    import RichTextFeature from "./feature/RichTextFeature.svelte";
    import { findCharInStructure } from "./findCharInStructure";
    import { getActiveTextNode } from "$lib/util/getActiveTextNode";
    import { setCaretPos } from "$lib/util/caret/setCaretPos";

    interface Props {
        raw: string;
    }

    let { raw = $bindable() }: Props = $props();
    const structure = $derived(richTextToStructure(raw));

    export function generateNewRaw(caretPos: number, beforeText: string): (() => void) | undefined {
        const caret = findCharInStructure(structure, caretPos);
        if (!caret) return;
        console.log(caret, caret[0].children[caret[1]]);

        const activeTextNode = getActiveTextNode();
        if (!activeTextNode) return;

        // svelte-check thinks this is string | null but its just string
        const afterText = activeTextNode.textContent!;
        caret[0].children[caret[1]] = afterText;

        raw = stringifyRichTextStructure(structure);

        const newPos = caretPos + afterText.length - beforeText.length;
        return () => setCaretPos(newPos); // so this runs AFTER svelte updates the DOM
    }
</script>

<RichTextFeature tag={structure.tag} bind:children={structure.children} />
