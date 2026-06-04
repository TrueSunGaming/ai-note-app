import type { RichTextStructure } from "../../RichTextStructure";
import { traversePath } from "./traversePath";

export function setTextAtPath(structure: RichTextStructure, path: string, content: string): void {
    const traverseResult = traversePath(structure, path);
    if (!traverseResult) return;
    const [node, childIndex] = traverseResult;

    node.children[childIndex] = content;
}
