import RichTextColor from "./RichTextColor.svelte";
import { RichTextFeatureData } from "../RichTextFeatureData";

new (class extends RichTextFeatureData {
    override readonly component = RichTextColor;

    override tagMatches(tag: string): boolean {
        return tag.startsWith("color ") && tag.length > 6;
    }
})();
