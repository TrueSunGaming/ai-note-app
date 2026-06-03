<script lang="ts">
    import RichTextFeature from "./feature/RichTextFeature.svelte";
    import type { RichTextStructure } from "./RichTextStructure";

    interface Props {
        children: (string | RichTextStructure)[];
        idxPath: string;
    }

    const { children, idxPath }: Props = $props();

    function combinePaths(parent: string, child: number): string {
        if (parent) return `${parent}/${child}`;
        return `${child}`;
    }
</script>

{#each children as child, idx (idx)}
    {#if typeof child == "string"}
        <span data-richtext-idx-path={combinePaths(idxPath, idx)}>{child}</span>
    {:else}
        <RichTextFeature
            tag={child.tag}
            children={child.children}
            idxPath={combinePaths(idxPath, idx)}
        />
    {/if}
{/each}
