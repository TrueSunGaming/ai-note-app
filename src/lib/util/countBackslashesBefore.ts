export function countBackslashesBefore(str: string, index: number): number {
    let count = 0;
    for (let i = index - 1; i >= 0; i--) {
        if (str[i] == "\\") count++;
        else break;
    }
    return count;
}