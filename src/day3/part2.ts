import { readFileSync } from "fs";
import { join } from "path";

const TREE = "#";

const data = readFileSync(join(__dirname, "input.txt"))
    .toString().split("\n").map(s => [...s]);

const getTreeCount = ( [stepX, stepY]: readonly [ number, number ]) => {
    const pos = { x: 0, y: 0 };
    let trees = 0;

    while (pos.y < data.length) {
        const here = data[pos.y][pos.x % data[0].length];

        if (here === TREE) {
            ++trees
        };

        pos.x += stepX
        pos.y += stepY
    }

    return trees;
}

const steps = [
    [1, 1],
    [3, 1],
    [5, 1],
    [7, 1],
    [1, 2]
] as const;

const result = steps.map(getTreeCount).reduce((x, y) => x * y, 1);

console.log(result);



