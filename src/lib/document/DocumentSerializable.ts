import type { Readable } from "svelte/store";

export interface DocumentSerializable {
    readonly uuid: string;
    readonly raw: Readable<unknown>;
    readonly json: Readable<string>;
    readonly markdown: Readable<string>;

    loadFromRaw(raw: unknown): void;
    loadFromJSON(json: string): void;
}
