<script lang="ts">
    import RichTextChildren from "../RichTextChildren.svelte";
    import { RichTextFeatureData } from "./RichTextFeatureData";
    import type { RichTextStructure } from "../RichTextStructure";

    interface Props {
        tag: string;
        children: (string | RichTextStructure)[];
    }

    // eslint-disable-next-line prefer-const
    let { tag, children }: Props = $props();
    const FeatureComponent = $derived(RichTextFeatureData.findMatch(tag)?.component);
</script>

{#if FeatureComponent !== undefined}
    <FeatureComponent {tag}>
        <RichTextChildren {children} />
    </FeatureComponent>
{:else}
    &lt;{tag}&gt;<RichTextChildren {children} />&lt;/&gt;
{/if}
