export function rawPaste(event: ClipboardEvent): void {
    event.preventDefault();

    const text = event.clipboardData?.getData("text/plain");
    if (!text) return;

    const selection = window.getSelection();
    if (!selection?.rangeCount) return;

    const range = selection.getRangeAt(0);
    range.deleteContents();
    range.insertNode(document.createTextNode(text));
}
