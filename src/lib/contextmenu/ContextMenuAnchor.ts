export interface ContextMenuAnchor {
    x: number;
    y: number;
    horizontalMode: "left" | "center" | "right";
    verticalMode: "top" | "bottom";
}

export function generateAnchorStyles(anchor: ContextMenuAnchor): string {
    let res = "";

    res += `left: ${anchor.x}px;`;
    res += `top: ${anchor.y}px;`;

    const transform: string[] = [];
    if (anchor.horizontalMode == "center") transform.push("translateX(-50%)");
    if (anchor.horizontalMode == "right") transform.push("translateX(-100%)");
    if (anchor.verticalMode == "bottom") transform.push("translateY(-100%)");
    if (transform.length > 0) res += `transform: ${transform.join(" ")};`;

    return res;
}
