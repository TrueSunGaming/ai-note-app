import { RichTextFeatureData } from "../RichTextFeatureData";
import RichTextUnderline from "./RichTextUnderline.svelte";

new (class extends RichTextFeatureData {
    override readonly component = RichTextUnderline;

    override tagMatches(tag: string): boolean {
        return tag == "underline";
    }
})();
