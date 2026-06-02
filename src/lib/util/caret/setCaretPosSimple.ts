export function setCaretPosSimple(node: Node, pos: number): void {
    const range = document.createRange();
    range.setStart(node, pos);
    range.collapse(true);

    const selection = window.getSelection();
    if (!selection) return;

    selection.removeAllRanges();
    selection.addRange(range);
}
