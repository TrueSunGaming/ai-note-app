import { getRichTextContainer } from "./getRichTextFromElement";

export function setRichTextOfElement(element: HTMLElement, raw: string, updateDOM = true): void {
    const container = getRichTextContainer(element, true)!;
    container.setAttribute("data-richtext-raw", raw);
    if (!updateDOM) container.dispatchEvent(new CustomEvent("cancelUpdate"));
    container.dispatchEvent(new CustomEvent("updateRaw"));
}
