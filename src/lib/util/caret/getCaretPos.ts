import { getHighestContenteditable } from "../getHighestContenteditable";

export function getCaretPos(): number | null {
    const selection = window.getSelection();
    if (!selection?.rangeCount) return null;

    const range = selection.getRangeAt(0);
    const startNode = range.startContainer;

    const editRoot = getHighestContenteditable(startNode);
    if (!editRoot) return null;

    let caretPos = 0;
    const iterator = document.createNodeIterator(editRoot, NodeFilter.SHOW_TEXT);

    while (iterator.nextNode()) {
        if (iterator.referenceNode == startNode) return caretPos + range.startOffset;
        caretPos += iterator.referenceNode.textContent?.length ?? 0;
    }

    return null;
}
