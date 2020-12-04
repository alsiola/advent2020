import { readFileSync } from "fs";
import { join } from "path";

const data = readFileSync(join(__dirname, "input.txt"))
  .toString()
  .split("\n")
  .map(Number);

const vals = new Set(data);

for (const val of vals) {
  for (const val2 of vals) {
    if (vals.has(2020 - val - val2)) {
      console.log(val * (2020 - val - val2) * val2);
      process.exit(0);
    }
  }
}
console.error("No match!");
process.exit(1);
