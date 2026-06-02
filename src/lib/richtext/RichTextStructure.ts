import { RichTextFeatureData } from "./feature/RichTextFeatureData";

export interface RichTextStructure {
    tag: string;
    children: (string | RichTextStructure)[];
}

const untilNextTagRegex = /^(.*?(?<!\\)(?:\\\\)*(?=<))/;
const newTagNameRegex = /^(.*?(?<!\\)(?:\\\\)*(?=>))/;

function unescapeRichText(raw: string): string {
    return raw.replaceAll("\\\\", "\\").replaceAll("\\<", "<").replaceAll("\\>", ">");
}

function escapeRichText(raw: string): string {
    return raw.replaceAll("\\", "\\\\").replaceAll("<", "\\<").replaceAll(">", "\\>");
}

export function richTextToStructure(raw: string): RichTextStructure {
    const result: RichTextStructure = {
        tag: "root",
        children: []
    };

    const addingTo = [result];
    let openedTags = 0;

    let idx = 0;
    while (idx < raw.length) {
        const untilNextTag = raw.slice(idx).match(untilNextTagRegex)?.[0] ?? "";
        if (untilNextTag.length > 0) addingTo.at(-1)!.children.push(unescapeRichText(untilNextTag));
        idx += untilNextTag.length + 1;

        const newTagName = raw.slice(idx).match(newTagNameRegex)?.[0] ?? "";
        if (newTagName.length == 0) throw new Error("Expected tag name");
        idx += newTagName.length + 1;

        if (newTagName == "/") {
            if (openedTags == 0) throw new Error("Unexpected closing tag");
            addingTo.pop();
            openedTags--;
            continue;
        }

        const newTag = {
            tag: unescapeRichText(newTagName),
            children: []
        };
        addingTo.at(-1)!.children.push(newTag);
        addingTo.push(newTag);
        openedTags++;
    }

    console.log(openedTags);
    if (openedTags != 0) throw new Error("Unclosed tags");

    return result;
}

export function stringifyRichTextStructure(structure: RichTextStructure): string {
    return structure.children
        .map((child) => {
            if (typeof child == "string") return escapeRichText(child);
            return `<${child.tag}>${stringifyRichTextStructure(child)}</>`;
        })
        .join("");
}

export function richTextStructureToMarkdown(structure: RichTextStructure): string {
    const feature = RichTextFeatureData.findMatch(structure.tag);
    if (!feature) return "(rich text failed to render)";

    return feature.toMarkdown(
        structure.tag,
        structure.children
            .map((child) => {
                if (typeof child == "string") return escapeRichText(child);
                return richTextStructureToMarkdown(child);
            })
            .join("")
    );
}

export function richTextToMarkdown(raw: string): string {
    return richTextStructureToMarkdown(richTextToStructure(raw));
}
