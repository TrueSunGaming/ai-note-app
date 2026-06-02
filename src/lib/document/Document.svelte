<script lang="ts">
    import Block from "./block/Block.svelte";
    import type { DocumentData } from "./DocumentData";

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
    </div>
</article>
