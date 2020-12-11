import { readFileSync } from "fs";
import { join } from "path";

const jolts = readFileSync(join(__dirname, "input.txt"))
    .toString()
    .split("\n")
    .map((v) => parseInt(v))
    .sort((a, b) => a - b);

jolts.unshift(0);

const getNext = (jolt: number, sl: number): number[] =>
    jolts.slice(sl).filter((j) => {
        const d = j - jolt;
        return d > 0 && d <= 3;
    });

const nexts = new Map<number, number[]>();
const journeys = new Map<number, number>();

jolts.forEach((j, i) => {
    nexts.set(j, getNext(j, i));
});

jolts.reverse().forEach((j) => {
    const jNexts = nexts.get(j)!;

    if (jNexts.length < 1) {
        journeys.set(j, 1);
        return;
    }

    journeys.set(
        j,
        jNexts.map((jn) => journeys.get(jn)!).reduce((a, b) => a + b, 0)
    );
});

console.log(journeys.get(0));
