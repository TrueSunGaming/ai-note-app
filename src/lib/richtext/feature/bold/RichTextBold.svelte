<script lang="ts">
    import type { RichTextFeatureProps } from "../RichTextFeatureComponent";

    const { children }: RichTextFeatureProps = $props();
</script>

<strong>
    {@render children()}
</strong>
