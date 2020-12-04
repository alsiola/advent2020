import { readFileSync } from "fs";
import { join } from "path";

const data = readFileSync(join(__dirname, "input.txt"))
  .toString()
  .split("\n")
  .map((s) => s.split(" ") as [string, string, string]);

const valid = data.reduce((count, [range, charS, password]) => {
  const [pos1, pos2] = range.split("-").map(Number);
  const char = charS[0];

  const charAtPos1 = password[pos1 - 1];
  const charAtPos2 = password[pos2 - 1];

  if (charAtPos1 === charAtPos2) {
    return count;
  }

  if (charAtPos1 === char || charAtPos2 === char) {
    return ++count;
  }

  return count;
}, 0);

console.log(valid);
