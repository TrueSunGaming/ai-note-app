<script lang="ts">
    import type { RichTextFeatureProps } from "../RichTextFeatureComponent";

    const { tag, children }: RichTextFeatureProps = $props();
</script>

<span style="color: {tag.slice(6)};">
    {@render children()}
</span>
