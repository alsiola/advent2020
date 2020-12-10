import { readFileSync } from "fs";
import { join } from "path";

const PREAMBLE = 25;

const ns = readFileSync(join(__dirname, "input.txt"))
    .toString()
    .split("\n")
    .map((n) => parseInt(n));

const isSum = (pre: number[], n: number): boolean => {
    console.log({ pre, n });
    const s = new Set(pre);

    return pre.some((m) => s.has(n - m));
};

const wrong = ns
    .slice(PREAMBLE)
    .find((n, i) => !isSum(ns.slice(i, i + PREAMBLE), n));

console.log(wrong);
