import { type Readable, type Writable, derived, get, writable } from "svelte/store";
import { BlockData } from "../BlockData";
import TextBlock from "./TextBlock.svelte";
import { richTextToMarkdown } from "$lib/richtext/RichTextStructure";

export interface RawTextBlock {
    type: "text";
    text: string;
}

export class TextBlockData extends BlockData {
    static {
        this.registerThis(TextBlock);
    }

    override readonly type = "text";

    readonly text: Writable<string> = writable("");

    override copy(): TextBlockData {
        const copy = new TextBlockData();
        copy.text.set(get(this.text));
        return copy;
    }

    protected override loadFromCheckedRaw(raw: object & Record<"type", typeof this.type>): void {
        if (!("text" in raw) || typeof raw.text != "string") return;

        this.text.set(raw.text);
    }

    override get raw(): Readable<RawTextBlock> {
        return derived(this.text, (text) => ({
            type: this.type as "text",
            text
        }));
    }

    get markdown(): Readable<string> {
        return derived(this.text, (text) => richTextToMarkdown(text));
    }
}
