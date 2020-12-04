import { readFileSync } from "fs";
import { join } from "path";

const TREE = "#";

const data = readFileSync(join(__dirname, "input.txt"))
    .toString().split("\n").map(s => [...s]);

const getTreeCount = (pos: { x: number; y: number; }) => (trees: number) => ([stepX, stepY]: readonly [number, number]): number => {

    if (pos.y >= data.length) {
        return trees;
    }

    const here = data[pos.y][pos.x % data[0].length];

    return getTreeCount({ x: pos.x + stepX, y: pos.y + stepY })(trees + (here === TREE ? 1 : 0))([stepX, stepY]);
}

const steps = [
    [1, 1],
    [3, 1],
    [5, 1],
    [7, 1],
    [1, 2]
] as const;

const result = steps.map(getTreeCount({ x: 0, y: 0})(0)).reduce((x, y) => x * y, 1);

console.log(result);



