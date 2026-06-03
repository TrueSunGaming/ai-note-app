import type { RichTextFeatureComponent } from "./RichTextFeatureComponent";

export abstract class RichTextFeatureData {
    static registry: RichTextFeatureData[] = [];

    constructor() {
        RichTextFeatureData.registry.push(this);
    }

    abstract readonly component: RichTextFeatureComponent;
    abstract tagMatches(tag: string): boolean;

    toMarkdown(tag: string, children: string): string {
        return `<${tag}>${children}</>`;
    }

    static findMatch(tag: string): RichTextFeatureData | undefined {
        return RichTextFeatureData.registry.find((f) => f.tagMatches(tag));
    }
}
