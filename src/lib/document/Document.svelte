<script lang="ts">
    import Block from "./block/Block.svelte";
    import type { DocumentData } from "./DocumentData";
    import DocumentInsertionArea from "./DocumentInsertionArea.svelte";
    import RichTextContextMenu from "$lib/richtext/contextmenu/RichTextContextMenu.svelte";

    interface Props {
        doc: DocumentData;
    }

    const { doc }: Props = $props();
    const { title, blocks } = $derived(doc);
</script>

<article>
    <header>
        <h1 contenteditable bind:innerText={$title}></h1>
    </header>

    <div>
        {#each $blocks as blockData (blockData.uuid)}
            <Block {blockData} {doc} />
        {/each}

        <DocumentInsertionArea {doc} />
    </div>
</article>

<RichTextContextMenu />

<style lang="scss">
    article,
    div {
        height: 100%;
    }
</style>
