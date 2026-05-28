<script lang="ts">
    import "$lib/style/fonts.scss";
    import "$lib/style/colors.scss";
    import "$lib/style/global.scss";
    import "$lib/style/classes.scss";

    const { children } = $props();
</script>

<main>
    {@render children()}
</main>
