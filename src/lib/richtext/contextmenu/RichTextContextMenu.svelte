<script lang="ts">
    import ContextMenu from "$lib/contextmenu/ContextMenu.svelte";
    import { onMount } from "svelte";

    let bold = $state(false);
    let italic = $state(false);
    let underline = $state(false);
    let anchorX: number | null = $state(null);
    let anchorY: number | null = $state(null);
    let menuVisible = $derived(anchorX != null && anchorY != null);

    function onSelectionChange(): void {
        const selection = window.getSelection();
        if (selection == null || selection.toString().length == 0) {
            anchorX = null;
            anchorY = null;
            return;
        }

        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        anchorX = rect.left + rect.width / 2;
        anchorY = rect.bottom;
    }

    onMount(() => {
        document.addEventListener("selectionchange", onSelectionChange);

        return () => document.removeEventListener("selectionchange", onSelectionChange);
    });
</script>

<ContextMenu
    bind:visible={menuVisible}
    anchor={{
        x: anchorX ?? 0,
        y: anchorY ?? 0,
        horizontalMode: "center",
        verticalMode: "top"
    }}
>
    <div>
        <input type="checkbox" id="bold" bind:checked={bold} />
        <input type="checkbox" id="italic" bind:checked={italic} />
        <input type="checkbox" id="underline" bind:checked={underline} />
    </div>
</ContextMenu>

<style lang="scss">
    div {
        background-color: var(--color-primary-1);
        border: 1px solid var(--color-primary-2);
        display: flex;
        padding: 4px;
        gap: 4px;
        flex-direction: row;
        border-radius: 8px;

        input[type="checkbox"] {
            display: inline-block;
            appearance: none;
            cursor: pointer;
            aspect-ratio: 1;
            width: 25px;
            border-radius: 4px;
            text-align: center;
            align-content: center;
            margin: 0;

            &:hover {
                background-color: var(--color-primary-3);
            }

            &:checked::before {
                color: var(--color-text);
            }

            &::before {
                font-family: "JetBrains Mono Variable", monospace;
                font-size: 16px;
                color: var(--color-text-1);
                font-weight: bold;
            }
        }

        #bold::before {
            content: "B";
        }

        #italic::before {
            content: "I";
            font-style: italic;
        }

        #underline::before {
            content: "U";
            text-decoration: underline;
        }
    }
</style>
