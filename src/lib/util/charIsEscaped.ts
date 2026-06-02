import { countBackslashesBefore } from "./countBackslashesBefore";

export function charIsEscaped(str: string, index: number): boolean {
    return countBackslashesBefore(str, index) % 2 == 1;
}
