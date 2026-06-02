import type { RichTextStructure } from "./RichTextStructure";

export function findCharInStructure(
    structure: RichTextStructure,
    characterIndex: number
): [RichTextStructure, number] | null {
    for (let i = 0; i < structure.children.length; i++) {
        const child = structure.children[i];

        if (typeof child == "string") {
            if (characterIndex <= child.length) return [structure, i];
            characterIndex -= child.length;
        } else {
            const found = findCharInStructure(child, characterIndex);
            if (found) return found;
        }
    }
    return null;
}
