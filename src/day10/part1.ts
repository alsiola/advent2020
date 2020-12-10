import { readFileSync } from "fs";
import { join } from "path";

const jolts = readFileSync(join(__dirname, "input.txt"))
    .toString()
    .split("\n")
    .map((v) => parseInt(v))
    .sort((a, b) => a - b);

jolts.unshift(0);
jolts.push(jolts[jolts.length - 1] + 3);

const gaps = jolts.reduce(
    (o, j, i) => {
        console.log({ j });
        if (typeof jolts[i + 1] === "undefined") {
            return o;
        }

        o[jolts[i + 1] - j - 1]++;

        return o;
    },
    [0, 0, 0]
);

console.log(gaps, gaps[0] * gaps[2]);
