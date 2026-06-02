import type { Component, Snippet } from "svelte";

export interface RichTextFeatureProps {
    tag: string;
    children: Snippet;
}

export type RichTextFeatureComponent = Component<RichTextFeatureProps>;
