import type { DocumentData } from "../DocumentData";

export function undoRedoShortcut(event: KeyboardEvent, node: HTMLElement, doc: DocumentData): void {
    if (!event.ctrlKey) return;

    if (event.code == "KeyZ") {
        event.preventDefault();
        doc.history.undo();
    }

    if (event.code == "KeyY") {
        event.preventDefault();
        doc.history.redo();
    }
}
