import RichTextBold from "./RichTextBold.svelte";
import { RichTextFeatureData } from "../RichTextFeatureData";

new (class extends RichTextFeatureData {
    override readonly component = RichTextBold;

    override tagMatches(tag: string): boolean {
        return tag == "bold";
    }

    override toMarkdown(_tag: string, children: string): string {
        return `**${children}**`;
    }
})();
