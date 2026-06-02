export function updateInnerText(node: HTMLElement, newText: string): void {
    node.innerText = newText;
    node.dispatchEvent(new Event("input"));
}
