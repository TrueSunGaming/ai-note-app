<script lang="ts">
    import RichTextFeature from "./feature/RichTextFeature.svelte";
    import type { RichTextStructure } from "./RichTextStructure";

    interface Props {
        children: (string | RichTextStructure)[];
    }

    let { children = $bindable() }: Props = $props();
</script>

{#each children as child, idx (idx)}
    {#if typeof child == "string"}
        <span>{child}</span>
    {:else}
        <RichTextFeature
            tag={child.tag}
            bind:children={
                () => child.children,
                (value) => {
                    child.children = value;
                    children = [...children];
                }
            }
        />
    {/if}
{/each}
