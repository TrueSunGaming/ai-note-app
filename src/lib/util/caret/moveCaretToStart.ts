export function moveCaretToStart(element: HTMLElement): void {
    element.focus();

    const range = document.createRange();
    const selection = window.getSelection();
    if (!selection) return console.error("Failed to move caret: No selection");

    range.selectNodeContents(element);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
}
