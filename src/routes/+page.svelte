<script lang="ts">
    import "$lib/document/block/text/TextBlockData";
    import Document from "$lib/document/Document.svelte";
    import { DocumentData } from "$lib/document/DocumentData";

    const doc = DocumentData.fromRaw({
        title: "My Document",
        blocks: [
            {
                type: "text",
                text: "Hello, <color red>wo<italic>rl</>d</><bold>!</>"
            }
        ]
    });

    const { raw, markdown } = $derived(doc);
</script>

<div>
    <section>
        <pre>{JSON.stringify($raw, null, 2)}</pre>
        <hr />
        <pre>{$markdown}</pre>
    </section>

    <main>
        <Document {doc} />
    </main>
</div>

<style lang="scss">
    div {
        display: flex;
        flex-direction: row;

        section {
            flex: 1;
            overflow-x: auto;
        }

        main {
            flex: 1.618;
        }
    }
</style>
