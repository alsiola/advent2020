import { readFileSync } from "fs";
import { join } from "path";

const data = readFileSync(join(__dirname, "input.txt"))
    .toString()
    .split("\n")
    .map(s => s.split(" ") as [string, string, string]);

const countChars = (s: string, c: string): number => {
    if (s.length === 0) {
        return 0;
    }

    return (s[0] === c ? 1 : 0) + countChars(s.substr(1), c)
}

const valid = data.reduce((count, [range, charS, password]) => {
    const [min, max] = range.split("-").map(Number);
    const char = charS[0];

    const pCount = countChars(password, char);

    if (pCount >= min && pCount <= max) {
        return ++count;
    }

    return count;
}, 0);

console.log(valid);