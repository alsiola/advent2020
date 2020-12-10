import { readFileSync } from "fs";
import { join } from "path";

const answers = readFileSync(join(__dirname, "input.txt"))
    .toString()
    .split("\n\n")
    .map((s) => s.split("\n").flatMap((p) => p.split("")))
    .map((as) => new Set(as))
    .reduce((a, b) => a + b.size, 0);

console.log(answers);
