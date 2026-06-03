import { BlockData } from "../block/BlockData";
import type { DocumentData } from "../DocumentData";
import type { TextBlockData } from "../block/text/TextBlockData";
import { getCaretPos } from "$lib/util/caret/getCaretPos";
import { getRichTextFromElement } from "$lib/richtext/editor-util/getRichTextFromElement";
import { getUUIDFromElement } from "../block/getUUIDFromElement";
import { moveCaretToStart } from "$lib/util/caret/moveCaretToStart";
import { setRichTextOfElement } from "$lib/richtext/editor-util/setRichTextOfElement";
import { splitRichText } from "$lib/richtext/editor-util/splitRichText";

export function newLine(event: KeyboardEvent, node: HTMLElement, doc: DocumentData): void {
    if (event.code != "Enter" || event.shiftKey) return;
    event.preventDefault();

    const raw = getRichTextFromElement(node, true);
    if (raw == null) return;

    const caretPos = getCaretPos();
    if (caretPos == null) return;
    const [originalCut, newLine] = splitRichText(raw, caretPos);

    const block = doc.getBlockFromUUID(getUUIDFromElement(node)!);

    const newBlock = BlockData.fromRaw({
        type: "text",
        text: newLine
    })! as TextBlockData;

    doc.addBlock(newBlock, block);
    setRichTextOfElement(node, originalCut);

    doc.pendingSelection = {
        uuid: newBlock.uuid,
        callback: () => {
            const newElement = document.querySelector<HTMLElement>(
                `[data-uuid="${newBlock.uuid}"]`
            );
            if (!newElement) throw new Error("newLine: Failed to get new element");
            moveCaretToStart(newElement);
        }
    };
}
