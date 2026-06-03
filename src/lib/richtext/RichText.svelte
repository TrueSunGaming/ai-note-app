<script lang="ts">
    import "./feature/loadFeatures";
    import { richTextToStructure, stringifyRichTextStructure } from "./RichTextStructure";
    import RichTextFeature from "./feature/RichTextFeature.svelte";
    import { getTextAtPath } from "./editor-util/getTextAtPath";
    import { setTextAtPath } from "./editor-util/setTextAtPath";

    interface Props {
        raw: string;
    }

    let { raw = $bindable() }: Props = $props();

    let element: HTMLSpanElement | null = $state(null);

    function addCancelUpdate(): void {
        cancelUpdates++;
    }

    function updateRaw(): void {
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
        const newRaw = raw; // force svelte to actually watch this

        if (cancelUpdates > 0) {
            cancelUpdates--;
            return;
        }

        renderingRaw = raw;
    });

    function updateRawWithoutDOM(): void {
        cancelUpdates++;
        raw = stringifyRichTextStructure(structure);
    }

    // TODO: handle some deletes by checking if activeBefore still exists
    export function generateNewRaw(activeBefore: Text | null): void {
        // const activeTextNode = getActiveTextNode();
        // if (!activeTextNode) return;

        if (!activeBefore) return;

        const textElement = activeBefore.parentElement;
        if (!textElement) return;

        const path = textElement.getAttribute("data-richtext-idx-path");
        if (path == null) return;

        const existingText = getTextAtPath(structure, path);
        const newText = textElement.innerText;

        if (newText == existingText) {
            // assume shift+enter
            setTextAtPath(structure, path, "\n" + existingText);
        } else {
            setTextAtPath(structure, path, textElement.innerText);
        }

        updateRawWithoutDOM();
    }
</script>

<span bind:this={element} data-richtext-raw={raw}>
    <RichTextFeature {...structure} />
</span>

<style lang="scss">
    span {
        white-space: pre;
    }
</style>
