import { readFileSync } from "fs";
import { join } from "path";

const ns = readFileSync(join(__dirname, "input.txt"))
    .toString()
    .split("\n")
    .map((n) => parseInt(n));

const target = 32321523;

let s: number;
let e: number;

ns.forEach((n, ni) => {
    let acc = n;
    let mi = 0;
    for (const m of ns.slice(ni + 1)) {
        ++mi;
        acc += m;
        if (acc === target) {
            s = ni;
            e = ni + mi + 1;
        }
        if (acc > target) {
            break;
        }
    }
});

const vals = ns.slice(s!, e!);
console.log(Math.min(...vals) + Math.max(...vals));
