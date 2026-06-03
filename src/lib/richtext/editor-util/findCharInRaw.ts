import { matchRichTextTags } from "../RichTextStructure";

export function findCharInRaw(raw: string, plaintextPos: number): number {
    if (plaintextPos < 0) return -1;

    const tags = matchRichTextTags(raw);
    let tagIndex = 0;

    let currentPlainPos = 0;
    let i = 0;

    while (i < raw.length) {
        // 1. Skip ONLY closing tags '</>' right now.
        // If we are right before a '</>', we advance past it BEFORE checking
        // the position match, which excludes it from the upcoming slice.
        while (
            tagIndex < tags.length &&
            i === tags[tagIndex].index &&
            tags[tagIndex][0] === "</>"
        ) {
            i += tags[tagIndex][0].length;
            tagIndex++;
        }

        // 2. Check for a match.
        // At this point, 'i' has skipped any '</>' tags, but is still sitting
        // RIGHT BEFORE any opening tags (like <bold> or <color>).
        if (currentPlainPos === plaintextPos) {
            return i;
        }

        // 3. Skip over any REMAINING tags (like opening tags) before processing the character.
        while (tagIndex < tags.length && i === tags[tagIndex].index) {
            i += tags[tagIndex][0].length;
            tagIndex++;
        }

        if (i >= raw.length) break;

        // 4. Process characters and escape sequences.
        if (raw[i] === "\\" && i + 1 < raw.length && (raw[i + 1] === "\\" || raw[i + 1] === "<")) {
            i += 2;
        } else {
            i += 1;
        }
        currentPlainPos++;
    }

    // Final guard for matching the position at the very end of the string
    while (tagIndex < tags.length && i === tags[tagIndex].index && tags[tagIndex][0] === "</>") {
        i += tags[tagIndex][0].length;
        tagIndex++;
    }

    if (currentPlainPos === plaintextPos) {
        return i;
    }

    return -1;
}

export function splitRichText(raw: string, plaintextPos: number): [string, string] {
    // Edge case: if splitting at or before the beginning
    if (plaintextPos <= 0) return ["", raw];

    const tags = matchRichTextTags(raw);
    let tagIndex = 0;

    const tagStack: string[] = [];
    let currentPlainPos = 0;
    let i = 0;

    while (i < raw.length) {
        // 1. Process closing tags '</' first.
        while (
            tagIndex < tags.length &&
            i === tags[tagIndex].index &&
            tags[tagIndex][0] === "</>"
        ) {
            tagStack.pop();
            i += tags[tagIndex][0].length;
            tagIndex++;
        }

        // 2. Check for a match.
        if (currentPlainPos === plaintextPos) {
            const leftClosers = "</>".repeat(tagStack.length);
            return [raw.slice(0, i) + leftClosers, tagStack.join("") + raw.slice(i)];
        }

        // 3. Process remaining tags (opening tags).
        while (tagIndex < tags.length && i === tags[tagIndex].index) {
            tagStack.push(tags[tagIndex][0]);
            i += tags[tagIndex][0].length;
            tagIndex++;
        }

        if (i >= raw.length) break;

        // 4. Process characters and escape sequences.
        if (
            raw[i] === "\\" &&
            i + 1 < raw.length &&
            (raw[i + 1] === "\\" || raw[i + 1] === "<" || raw[i + 1] === ">")
        ) {
            i += 2;
        } else {
            i += 1;
        }
        currentPlainPos++;
    }

    // Final sweep for trailing closing tags if the position is at the very end of the string
    while (tagIndex < tags.length && i === tags[tagIndex].index && tags[tagIndex][0] === "</>") {
        tagStack.pop();
        i += tags[tagIndex][0].length;
        tagIndex++;
    }

    if (currentPlainPos === plaintextPos) {
        const leftClosers = "</>".repeat(tagStack.length);
        return [raw.slice(0, i) + leftClosers, tagStack.join("") + raw.slice(i)];
    }

    // Edge case: plaintextPos is out of bounds (past the end of the string)
    return [raw, ""];
}
