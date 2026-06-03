export function getUUIDFromElement(element: HTMLElement): string | null {
    if (element.hasAttribute("data-uuid")) return element.getAttribute("data-uuid");
    return element.parentElement ? getUUIDFromElement(element.parentElement) : null;
}
