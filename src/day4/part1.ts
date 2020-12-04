import { readFileSync } from "fs";
import { join } from "path";

const passports = readFileSync(join(__dirname, "input.txt"))
  .toString()
  .split("\n\n")
  .map((s) => s.split("\n").flatMap((s) => s.split(" ")))
  .map((p) => {
    return p.reduce((o, el) => {
      const [k, v] = el.split(":");

      return { ...o, [k]: v };
    }, {});
  });

const requiredFields = ["byr", "iyr", "eyr", "hgt", "hcl", "ecl", "pid"];

const valid = passports.filter((passport) => {
  const props = Object.getOwnPropertyNames(passport);
  return requiredFields.every((f) => props.includes(f));
});

console.log(valid.length);
