import type { RichTextStructure } from "../../RichTextStructure";
import { traversePath } from "./traversePath";

export function getTextAtPath(structure: RichTextStructure, path: string): string | null {
    const traverseResult = traversePath(structure, path);
    if (!traverseResult) return null;
    const [node, childIndex] = traverseResult;

    return node.children[childIndex] as string;
}
