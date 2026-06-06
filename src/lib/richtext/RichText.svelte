<script lang="ts">
    import "./feature/loadFeatures";
    import { onMount, tick } from "svelte";
    import { richTextToStructure, stringifyRichTextStructure } from "./RichTextStructure";
    import RichTextContextMenu from "./contextmenu/RichTextContextMenu.svelte";
    import RichTextFeature from "./feature/RichTextFeature.svelte";
    import { deletePath } from "./editor-util/path/deletePath";
    import { getTextAtPath } from "./editor-util/path/getTextAtPath";
    import { setTextAtPath } from "./editor-util/path/setTextAtPath";

    interface Props {
        raw: string;
    }

    let { raw = $bindable() }: Props = $props();
    let element: HTMLSpanElement | null = $state(null);
    let cancelDOM = 0;
    let observerDisabled = false;
    let renderingRaw = $state("");
    const structure = $derived(richTextToStructure(renderingRaw));

    function addCancelUpdate(): void {
        cancelDOM++;
    }

    function updateRaw(): void {
        raw = element!.getAttribute("data-richtext-raw")!;
        console.log("updateRaw", raw);
    }

    onMount(() => {
        if (element == null) return;
        const el = element;

        el.addEventListener("updateRaw", updateRaw);
        el.addEventListener("cancelUpdate", addCancelUpdate);

        return () => {
            el.removeEventListener("updateRaw", updateRaw);
            el.removeEventListener("cancelUpdate", addCancelUpdate);
        };
    });

    $effect(() => {
        const newRaw = raw; // force svelte to actually watch this

        if (cancelDOM > 0) {
            cancelDOM--;
            return;
        }

        observerDisabled = true;
        renderingRaw = newRaw;
        tick().then(() => (observerDisabled = false));
    });

    function updateRawWithoutDOM(): void {
        cancelDOM++;
        raw = stringifyRichTextStructure(structure);
    }

    function handleAttributesMutation(mutation: MutationRecord): void {
        if (mutation.attributeName == "data-richtext-raw") return updateRaw();
    }

    function handleRemovedFilter(node: Node): boolean {
        if (node.nodeType == Node.COMMENT_NODE) return false;
        if (node.nodeType == Node.TEXT_NODE && (node.textContent?.length ?? 0) == 0) return false;
        return true;
    }

    function handleRemovedNodes(mutation: MutationRecord): void {
        const removed = Array.from(mutation.removedNodes).filter(handleRemovedFilter);
        if (removed.length == 0) return;

        const removedPathElements = removed.flatMap((n) => {
            if (!(n instanceof Element)) return [];
            if (n.hasAttribute("data-richtext-idx-path")) return n;
            return Array.from(n.querySelectorAll("[data-richtext-idx-path]"));
        });

        for (const i of removedPathElements)
            deletePath(structure, i.getAttribute("data-richtext-idx-path")!);

        updateRawWithoutDOM();
    }

    function handleAddedNodes(mutation: MutationRecord): void {
        const addedText = Array.from(mutation.addedNodes).filter((n) => n instanceof Text);

        const prevSibling = mutation.previousSibling;
        if (!prevSibling) return;

        const prevElement = prevSibling.parentElement;
        if (!prevElement) return;

        const path = prevElement.getAttribute("data-richtext-idx-path");
        if (!path) return;

        const originalText = getTextAtPath(structure, path);
        setTextAtPath(
            structure,
            path,
            originalText + addedText.map((t) => t.textContent ?? "").join("")
        );
        updateRawWithoutDOM();
    }

    function handleChildListMutation(mutation: MutationRecord): void {
        handleRemovedNodes(mutation);
        handleAddedNodes(mutation);
    }

    function handleCharacterDataMutation(mutation: MutationRecord): void {
        const mutatedElement = mutation.target.parentElement;
        if (!mutatedElement) return;

        const path = mutatedElement.getAttribute("data-richtext-idx-path");
        if (!path) return;

        setTextAtPath(structure, path, mutatedElement.textContent ?? "");
        updateRawWithoutDOM();
    }

    function handleMutation(mutation: MutationRecord): void {
        console.log(mutation);

        switch (mutation.type) {
            case "attributes":
                handleAttributesMutation(mutation);
                break;
            case "childList":
                handleChildListMutation(mutation);
                break;
            case "characterData":
                handleCharacterDataMutation(mutation);
                break;
        }
    }

    const observer = new MutationObserver((mutations) => {
        if (observerDisabled) return;

        for (const mutation of mutations) handleMutation(mutation);
    });

    onMount(() => {
        if (element == null) return;

        observer.observe(element, {
            attributes: true,
            childList: true,
            subtree: true,
            characterData: true
        });

        return () => observer.disconnect();
    });
</script>

<span bind:this={element} data-richtext-raw={raw}>
    <RichTextFeature {...structure} />
</span>
