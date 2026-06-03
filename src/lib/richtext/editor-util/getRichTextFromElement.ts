export function getRichTextContainer(element: HTMLElement, useChild = false): HTMLElement | null {
    if (useChild) {
        const container = element.querySelector("[data-richtext-raw]");
        if (container) return container as HTMLElement;
    }

    if (element.hasAttribute("data-richtext-raw")) return element;
    return element.parentElement ? getRichTextContainer(element.parentElement) : null;
}

export function getRichTextFromElement(element: HTMLElement, useChild = false): string | null {
    return getRichTextContainer(element, useChild)?.getAttribute("data-richtext-raw") ?? null;
}
