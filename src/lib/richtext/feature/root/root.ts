import { RichTextFeatureData } from "../RichTextFeatureData";
import RichTextRoot from "./RichTextRoot.svelte";

new (class extends RichTextFeatureData {
    override readonly component = RichTextRoot;

    override tagMatches(tag: string): boolean {
        return tag == "root";
    }

    override toMarkdown(_tag: string, children: string): string {
        return children;
    }
})();
