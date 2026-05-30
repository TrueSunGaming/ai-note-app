export function filterNullish<T>(arr: T[]): NonNullable<T>[] {
    return arr.filter((item) => item !== null && item !== undefined) as NonNullable<T>[];
}
