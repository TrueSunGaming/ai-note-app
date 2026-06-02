import { type Readable, derived } from "svelte/store";
import type { BlockComponent } from "./BlockComponent";
import type { DocumentSerializable } from "../DocumentSerializable";
import { v4 as uuidv4 } from "uuid";

export abstract class BlockData implements DocumentSerializable {
    static registry: Map<string, [typeof BlockData, BlockComponent]> = new Map();

    protected static registerThis(component: BlockComponent): void {
        BlockData.registry.set(new (this as unknown as new () => BlockData)().type, [
            this,
            component
        ]);
    }

    abstract readonly type: string;
    readonly uuid = uuidv4();

    abstract copy(): BlockData;
    protected abstract loadFromCheckedRaw(raw: object & Record<"type", typeof this.type>): void;
    abstract readonly raw: Readable<unknown>;
    abstract readonly markdown: Readable<string>;

    cancelHistory = 0;

    loadFromRaw(raw: unknown): void {
        const errorMessage = `Failed to load ${this.constructor.name}: `;

        if (!raw || typeof raw != "object")
            return console.error(errorMessage, raw, " is not an object");
        if (!("type" in raw) || raw.type != this.type)
            return console.error(errorMessage, raw, ` is not of type "${this.type}"`);

        this.loadFromCheckedRaw(raw as object & Record<"type", typeof this.type>);
    }

    loadFromJSON(json: string): void {
        this.loadFromRaw(JSON.parse(json));
    }

    get json(): Readable<string> {
        return derived(this.raw, (raw) => JSON.stringify(raw));
    }

    static fromRaw(raw: unknown): BlockData | undefined {
        if (!raw || typeof raw != "object") {
            console.error("Failed to create BlockData: ", raw, " is not an object");
            return;
        }

        if (!("type" in raw) || typeof raw.type != "string") {
            console.error(
                "Failed to create BlockData: ",
                raw,
                ' is not an object with a "type" property'
            );
            return;
        }

        const blockClass = BlockData.registry.get(raw.type)?.[0];
        if (!blockClass) {
            console.error("Failed to create BlockData:", raw.type, "is not a valid block type");
            return;
        }

        const block = new (blockClass as unknown as new () => BlockData)();
        block.loadFromRaw(raw);
        return block;
    }

    static fromJSON(json: string): BlockData | undefined {
        return BlockData.fromRaw(JSON.parse(json));
    }
}
