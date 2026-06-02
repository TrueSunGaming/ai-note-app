export function getHighestContenteditable(node: Node): HTMLElement | null {
    if (node instanceof HTMLElement && node.hasAttribute("contenteditable")) return node;
    return node.parentElement ? getHighestContenteditable(node.parentElement) : null;
}
