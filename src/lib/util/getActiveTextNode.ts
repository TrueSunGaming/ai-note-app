export function getActiveTextNode(): Text | null {
    const selection = window.getSelection();
    if (!selection?.rangeCount) return null;

    const range = selection.getRangeAt(0);
    return range.startContainer instanceof Text ? range.startContainer : null;
}
