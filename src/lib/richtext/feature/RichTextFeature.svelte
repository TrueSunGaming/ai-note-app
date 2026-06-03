<script lang="ts">
    import RichTextChildren from "../RichTextChildren.svelte";
    import { RichTextFeatureData } from "./RichTextFeatureData";
    import type { RichTextStructure } from "../RichTextStructure";

    interface Props {
        tag: string;
        children: (string | RichTextStructure)[];
        idxPath?: string;
    }

    // eslint-disable-next-line prefer-const
    let { tag, children, idxPath = "" }: Props = $props();
    const FeatureComponent = $derived(RichTextFeatureData.findMatch(tag)?.component);
</script>

{#if FeatureComponent !== undefined}
    <FeatureComponent {tag}>
        <RichTextChildren {children} {idxPath} />
    </FeatureComponent>
{:else}
    &lt;{tag}&gt;<RichTextChildren {children} {idxPath} />&lt;/&gt;
{/if}
