import { getRichTextContainer } from "./getRichTextFromElement";

export function setRichTextOfElement(element: HTMLElement, raw: string, updateDOM = true): void {
    const container = getRichTextContainer(element, true)!;
    if (!updateDOM) container.dispatchEvent(new CustomEvent("cancelUpdate"));
    container.setAttribute("data-richtext-raw", raw);
}
