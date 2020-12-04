import { readFileSync } from "fs";
import { join } from "path";

const data = readFileSync(join(__dirname, "input.txt"))
  .toString()
  .split("\n")
  .map(Number);

const vals = new Set(data);

for (const val of data) {
  if (vals.has(2020 - val)) {
    console.log(val * (2020 - val));
    process.exit(0);
  }
}
console.error("No match!");
process.exit(1);
