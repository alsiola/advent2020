import { readFileSync } from "fs";
import { join } from "path";

const toBin = (char: string): 1 | 0 => {
    switch (char) {
        case "F":
        case "L":
            return 0;
        case "B":
        case "R":
            return 1;
    }
    throw new Error(`Invalid seat with code ${char}`);
};

const seats = readFileSync(join(__dirname, "input.txt"))
    .toString()
    .split("\n")
    .map((s) => [s.substr(0, 7), s.substr(7, 10)])
    .map(([row, seat]) => [
        parseInt(row.split("").map(toBin).join(""), 2),
        parseInt(seat.split("").map(toBin).join(""), 2),
    ])
    .map(([row, seat]) => row * 8 + seat);

console.log(Math.max(...seats));
