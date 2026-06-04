import type { RichTextStructure } from "../../RichTextStructure";
import { setTextAtPath } from "./setTextAtPath";

export function deletePath(structure: RichTextStructure, path: string): void {
    setTextAtPath(structure, path, "");
}
