<script lang="ts">
    import { type ContextMenuAnchor, generateAnchorStyles } from "./ContextMenuAnchor";
    import type { Snippet } from "svelte";

    interface Props {
        anchor: ContextMenuAnchor;
        visible?: boolean;
        children: Snippet;
    }

    // eslint-disable-next-line prefer-const
    let { anchor, visible = $bindable(), children }: Props = $props();
    let element: HTMLDivElement;

    export function show(): void {
        element.showPopover();
        visible = true;
    }

    export function hide(): void {
        element.hidePopover();
        visible = false;
    }

    $effect(() => {
        if (visible) show();
        else hide();
    });
</script>

<div bind:this={element} popover="manual" style={generateAnchorStyles(anchor)}>
    {@render children()}
</div>

<style lang="scss">
    div {
        position: absolute;
        background-color: transparent;
        border: none;
        outline: none;
        padding: 0;
        margin: 0;
        user-select: none;
    }
</style>
