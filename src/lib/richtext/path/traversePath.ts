import type { RichTextStructure } from "../RichTextStructure";

export function traversePath(
    structure: RichTextStructure,
    path: string
): [RichTextStructure, number] | null {
    const parts = path.split("/").map((p) => parseInt(p));

    let node = structure;
    for (let i = 0; i < parts.length; i++) {
        const part = parts[i];

        if (i == parts.length - 1) {
            return [node, part];
        }

        if (typeof node.children[part] == "string") return null;
        node = node.children[part];
    }

    return null;
}
