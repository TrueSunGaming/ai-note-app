<script lang="ts">
    import "./feature/loadFeatures";
    import { richTextToStructure, stringifyRichTextStructure } from "./RichTextStructure";
    import RichTextFeature from "./feature/RichTextFeature.svelte";
    import { findCharInStructure } from "./editor-util/findCharInStructure";
    import { getActiveTextNode } from "$lib/util/getActiveTextNode";
    import { setCaretPos } from "$lib/util/caret/setCaretPos";
    import { untrack } from "svelte";

    interface Props {
        raw: string;
    }

    let { raw = $bindable() }: Props = $props();

    let element: HTMLSpanElement | null = $state(null);

    function addCancelUpdate(): void {
        cancelUpdates++;
    }

    function updateRaw(): void {
        console.log("hi");
        raw = element!.getAttribute("data-richtext-raw")!;
    }

    $effect(() => {
        if (element == null) return;

        const el = element;

        el.addEventListener("updateRaw", updateRaw);
        el.addEventListener("cancelUpdate", addCancelUpdate);

        return () => {
            el.removeEventListener("updateRaw", updateRaw);
            el.removeEventListener("cancelUpdate", addCancelUpdate);
        };
    });

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

    export function generateNewRaw(caretPos: number): void {
        const caret = findCharInStructure(structure, caretPos);
        if (!caret) return;
        const [updateStruct, updateChild] = caret;

        const activeTextNode = getActiveTextNode();
        if (!activeTextNode) return;

        // svelte-check thinks this is string | null but its just string
        updateStruct.children[updateChild] = activeTextNode.textContent!;

        cancelUpdates++;
        raw = stringifyRichTextStructure(structure);
    }
</script>

<span bind:this={element} data-richtext-raw={raw}>
    <RichTextFeature tag={structure.tag} bind:children={structure.children} />
</span>
