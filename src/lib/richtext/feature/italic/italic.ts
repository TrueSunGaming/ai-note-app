import { RichTextFeatureData } from "../RichTextFeatureData";
import RichTextItalic from "./RichTextItalic.svelte";

new (class extends RichTextFeatureData {
    override readonly component = RichTextItalic;

    override tagMatches(tag: string): boolean {
        return tag == "italic";
    }

    override toMarkdown(_tag: string, children: string): string {
        return `*${children}*`;
    }
})();
