<script lang="ts">
    import type { RichTextFeatureProps } from "../RichTextFeatureComponent";

    const { children }: RichTextFeatureProps = $props();
</script>

<span style="text-decoration: underline;">
    {@render children()}
</span>
