import { readFileSync } from "fs";
import { join } from "path";

const TREE = "#";

const data = readFileSync(join(__dirname, "input.txt"))
    .toString().split("\n").map(s => [...s]);

const pos = { x: 0, y: 0 };
let trees = 0;

while (pos.y < data.length) {
    const here = data[pos.y][pos.x % data[0].length];
    
    if (here === TREE) {
        ++trees
    };

    pos.x += 3
    pos.y +=1
}

console.log(trees);



