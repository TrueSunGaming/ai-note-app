import { BlockData } from "../block/BlockData";
import type { DocumentData } from "../DocumentData";
import { moveCaretToStart } from "$lib/util/caret/moveCaretToStart";
import { updateInnerText } from "$lib/util/updateInnerText";

export function newLine(event: KeyboardEvent, node: HTMLElement, doc: DocumentData): void {
    if (event.code != "Enter" || event.shiftKey) return;
    event.preventDefault();

    const selection = window.getSelection();
    if (!selection?.rangeCount) return;

    const range = selection.getRangeAt(0);

    const testRange = document.createRange();
    testRange.selectNodeContents(node);
    testRange.setStart(range.endContainer, range.endOffset);

    const nextLineText = testRange.toString().trim();
    const block = doc.getBlockFromUUID(node.getAttribute("data-uuid")!);
    if (!block) return console.error("newLine: Failed to get block");

    const newBlock = BlockData.fromRaw({
        type: "text",
        text: nextLineText
    })!;

    const copyRange = range.cloneRange();

    doc.history.pushAction({
        do: () => {
            doc.addBlock(newBlock, block);

            block.cancelHistory++;
            updateInnerText(node, node.innerText.slice(0, copyRange.startOffset));

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
        },
        // TODO: implement undo
        undo: () => {}
    });
}
