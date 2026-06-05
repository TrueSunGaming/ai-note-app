import { type Readable, type Writable, derived, get, writable } from "svelte/store";
import { BlockData } from "./block/BlockData";
import { DocumentHistory } from "./history/DocumentHistory";
import type { DocumentSerializable } from "./DocumentSerializable";
import { filterNullish } from "$lib/util/filterNullish";
import { v4 as uuidv4 } from "uuid";

export interface RawDocument {
    uuid: string;
    title: string;
    blocks: unknown[];
}

export interface DocumentPendingSelection {
    uuid: string;
    callback: () => void;
}

export class DocumentData implements DocumentSerializable {
    readonly uuid: string;

    readonly title: Writable<string>;
    readonly blocks: Writable<BlockData[]> = writable([]);

    pendingSelection: DocumentPendingSelection | null = null;
    readonly history = new DocumentHistory();

    constructor(title = "Untitled Document", uuid = uuidv4()) {
        this.title = writable(title);
        this.uuid = uuid;
    }

    get raw(): Readable<RawDocument> {
        return derived([this.title, this.blocks], ([title, blocks], set) => {
            const blockRawStore = blocks.map((b) => b.raw);
            const blockRaw = derived(blockRawStore, (raw) => raw);

            blockRaw.subscribe(($blockRaw) => {
                set({
                    uuid: this.uuid,
                    title,
                    blocks: $blockRaw
                });
            });
        });
    }

    get json(): Readable<string> {
        return derived(this.raw, (raw) => JSON.stringify(raw));
    }

    get allBlocks(): Readable<BlockData[]> {
        return derived(this.blocks, (blocks, set) => {
            const childrenStores = blocks.map((b) => b.children);
            const all = derived(childrenStores, (children) => [...blocks, ...children.flat()]);

            all.subscribe(($children) => set($children));
        });
    }

    get markdown(): Readable<string> {
        return derived(
            [this.title, this.blocks],
            ([title, blocks], set) => {
                const blockMarkdownStores = blocks.map((b) => b.markdown);
                const blockMarkdown = derived(blockMarkdownStores, (md) => md.join("\n\n"));

                blockMarkdown.subscribe(($blockMarkdown) => {
                    set(`# ${title}\n---\n\n${$blockMarkdown}`);
                });
            },
            ""
        );
    }

    private getTitleFromRaw(raw: unknown): string {
        if (!raw || typeof raw != "object") return "Untitled Document";
        if (!("title" in raw) || typeof raw.title != "string") return "Untitled Document";
        return raw.title;
    }

    private getBlocksFromRaw(raw: unknown): BlockData[] {
        if (!raw || typeof raw != "object") return [];
        if (!("blocks" in raw) || !Array.isArray(raw.blocks)) return [];

        return filterNullish(raw.blocks.map((b) => BlockData.fromRaw(b)));
    }

    loadFromRaw(raw: unknown): void {
        this.title.set(this.getTitleFromRaw(raw));
        this.blocks.set(this.getBlocksFromRaw(raw));
    }

    loadFromJSON(json: string): void {
        this.loadFromRaw(JSON.parse(json));
    }

    static fromRaw(raw: unknown): DocumentData {
        const doc = new DocumentData();
        doc.loadFromRaw(raw);
        return doc;
    }

    static fromJSON(json: string): DocumentData {
        return DocumentData.fromRaw(JSON.parse(json));
    }

    getBlockFromUUID(uuid: string): BlockData | undefined {
        return get(this.allBlocks).find((b) => b.uuid == uuid);
    }

    private static getBlockIndex(blocks: BlockData[], block: BlockData | number): number | null {
        if (typeof block == "number") {
            if (block >= 0) return block;
            return blocks.length + block;
        }

        const found = blocks.indexOf(block);
        return found == -1 ? null : found;
    }

    addBlock(block: BlockData, after: BlockData | number = -1): void {
        this.blocks.update((blocks) => {
            const index = DocumentData.getBlockIndex(blocks, after) ?? blocks.length - 1;

            const newBlocks = [...blocks];
            newBlocks.splice(index + 1, 0, block);
            return newBlocks;
        });
    }

    removeBlock(block: BlockData | number): void {
        this.blocks.update((blocks) => {
            const index = DocumentData.getBlockIndex(blocks, block);
            if (index == null) return blocks;

            const newBlocks = [...blocks];
            newBlocks.splice(index, 1);
            return newBlocks;
        });
    }
}
