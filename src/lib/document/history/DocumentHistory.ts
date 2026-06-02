import type { HistoryAction } from "./HistoryAction";

export class DocumentHistory {
    private actions: HistoryAction[] = [];
    private lastActionIndex = -1;

    clearFuture(): void {
        this.actions.splice(this.lastActionIndex + 1);
    }

    pushAction(action: HistoryAction, alreadyDone = false): void {
        this.clearFuture();
        this.actions.push(action);
        if (!alreadyDone) action.do();
        this.lastActionIndex++;
    }

    undo(): void {
        if (this.lastActionIndex == -1) return;

        this.actions[this.lastActionIndex].undo();
        this.lastActionIndex--;
    }

    redo(): void {
        if (this.lastActionIndex == this.actions.length - 1) return;

        this.actions[this.lastActionIndex + 1].do();
        this.lastActionIndex++;
    }
}
