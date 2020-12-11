import { readFileSync } from "fs";
import { join } from "path";

const initialPlan = readFileSync(join(__dirname, "input.txt"))
    .toString()
    .split("\n")
    .map((s) => s.split("") as Space[]);

/**
 * If a seat is empty (L) and there are no occupied seats adjacent to it, the seat becomes occupied.
If a seat is occupied (#) and four or more seats adjacent to it are also occupied, the seat becomes empty.
Otherwise, the seat's state does not change.
 */

enum Space {
    Empty = "L",
    Floor = ".",
    Occupied = "#",
}

const iterate = (
    plan: Space[][]
): { changes: Array<[number, number, string]>; newPlan: Space[][] } => {
    const newPlan = Array.from(Array(plan.length), () => [] as Space[]);
    let changes: Array<[number, number, string]> = [];

    plan.forEach((row, rowNumber) => {
        row.forEach((seat, seatNumber) => {
            if (seat === Space.Floor) {
                newPlan[rowNumber][seatNumber] = seat;
                return;
            }
            const prevRow = plan[rowNumber - 1];
            const nextRow = plan[rowNumber + 1];
            const adjacents = [
                prevRow?.[seatNumber - 1],
                prevRow?.[seatNumber],
                prevRow?.[seatNumber + 1],
                row[seatNumber - 1],
                row[seatNumber + 1],
                nextRow?.[seatNumber - 1],
                nextRow?.[seatNumber],
                nextRow?.[seatNumber + 1],
            ].filter((x) => !!x);

            const satIn = adjacents.filter((s) => s === Space.Occupied);

            if (satIn.length >= 4 && seat === Space.Occupied) {
                newPlan[rowNumber][seatNumber] = Space.Empty;
                changes.push([rowNumber, seatNumber, "emptied"]);
            } else if (satIn.length === 0 && seat === Space.Empty) {
                newPlan[rowNumber][seatNumber] = Space.Occupied;
                changes.push([rowNumber, seatNumber, "filled"]);
            } else {
                newPlan[rowNumber][seatNumber] = seat;
            }
        });
    });

    return {
        newPlan,
        changes,
    };
};

let workingPlan = initialPlan;
let i = 0;
while (true) {
    ++i;
    const { newPlan, changes } = iterate(workingPlan);
    workingPlan = newPlan;
    if (changes.length === 0) {
        break;
    }
}

console.log(i, "iterations");

console.log(
    workingPlan.flatMap((x) => x).filter((x) => x === Space.Occupied).length
);
