import type { Action } from "svelte/action";
import type { DocumentData } from "../DocumentData";
import { newLine } from "./newLine";
import { undoRedoShortcut } from "./undoRedoShortcut";

type DocEventCallback<T extends Event> = (
    event: T,
    node: HTMLElement,
    doc: DocumentData
) => boolean | void;

const keyDownCallbacks: DocEventCallback<KeyboardEvent>[] = [newLine, undoRedoShortcut];

export const events: Action<HTMLElement, DocumentData> = (node, doc) => {
    $effect(() => {
        const keyDownListener = (event: KeyboardEvent): void => {
            for (const i of keyDownCallbacks) {
                const result = i(event, node, doc);
                if (result) return;
            }
        };

        node.addEventListener("keydown", keyDownListener);

        return () => {
            node.removeEventListener("keydown", keyDownListener);
        };
    });
};
