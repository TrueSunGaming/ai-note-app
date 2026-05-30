import type { BlockData } from "./BlockData";
import type { Component } from "svelte";

export interface BlockComponentProps {
    blockData: BlockData;
}

export type BlockComponent = Component<BlockComponentProps>;
