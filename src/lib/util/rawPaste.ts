export function rawPaste(event: ClipboardEvent): void {
    event.preventDefault();

    const text = event.clipboardData?.getData("text/plain");
    if (!text) return;

    const selection = window.getSelection();
    if (!selection?.rangeCount) return;

    document.activeElement?.dispatchEvent(new InputEvent("beforeinput"));

    const range = selection.getRangeAt(0);
    range.deleteContents();
    range.insertNode(document.createTextNode(text));
    document.normalize();

    range.setStart(range.endContainer, range.endOffset);
    selection.removeAllRanges();
    selection.addRange(range);

    document.activeElement?.dispatchEvent(new InputEvent("input"));
}
