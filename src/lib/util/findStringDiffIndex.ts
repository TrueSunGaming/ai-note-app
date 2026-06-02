export function findStringDiffIndex(a: string, b: string): number {
    for (let i = 0; i < Math.max(a.length, b.length); i++) {
        if (a[i] != b[i]) return i;
    }
    return -1;
}

export function findStringDiffIndexReverse(a: string, b: string): number {
    for (let i = 0; i < Math.max(a.length, b.length); i++) {
        if (a[a.length - i] != b[b.length - i]) return i;
    }
    return -1;
}
