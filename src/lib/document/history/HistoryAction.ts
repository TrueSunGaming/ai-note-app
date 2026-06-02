export interface HistoryAction {
    do(): void;
    undo(): void;
}
