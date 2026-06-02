import type { BlockData } from "./BlockData";
import type { Component } from "svelte";
import type { DocumentData } from "../DocumentData";

export interface BlockComponentProps {
    doc: DocumentData;
    blockData: BlockData;
}

export type BlockComponent = Component<BlockComponentProps>;
