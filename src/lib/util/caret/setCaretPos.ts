import { getHighestContenteditable } from "../getHighestContenteditable";
import { setCaretPosSimple } from "./setCaretPosSimple";

export function setCaretPos(pos: number): void {
    const selection = window.getSelection();
    if (!selection?.rangeCount) return;

    const range = selection.getRangeAt(0);
    const startNode = range.startContainer;

    const editRoot = getHighestContenteditable(startNode);
    if (!editRoot) return;

    const iterator = document.createNodeIterator(editRoot, NodeFilter.SHOW_TEXT);

    let charCount = 0;
    let targetNode: Node | null = null;
    let targetOffset = 0;

    while (iterator.nextNode()) {
        const nodeLength = iterator.referenceNode.textContent?.length ?? 0;

        if (charCount + nodeLength >= pos) {
            targetNode = iterator.referenceNode;
            targetOffset = pos - charCount;
            break;
        }

        charCount += nodeLength;
    }

    if (!targetNode && charCount == pos) {
        const lastNode = editRoot.lastChild ?? editRoot;
        targetNode = lastNode;
        targetOffset = iterator.referenceNode.textContent?.length ?? 0;
    }

    if (targetNode) setCaretPosSimple(targetNode, targetOffset);
}
