<script lang="ts">
    import RichTextFeature from "./feature/RichTextFeature.svelte";
    import type { RichTextStructure } from "./RichTextStructure";

    interface Props {
        children: (string | RichTextStructure)[];
    }

    const { children }: Props = $props();
</script>

{#each children as child, idx (idx)}
    {#if typeof child == "string"}
        <span>{child}</span>
    {:else}
        <RichTextFeature tag={child.tag} children={child.children} />
    {/if}
{/each}
