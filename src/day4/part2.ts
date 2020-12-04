import { readFileSync } from "fs";
import { join } from "path";

const passports: Array<Record<string, string>> = readFileSync(
  join(__dirname, "input.txt")
)
  .toString()
  .split("\n\n")
  .map((s) => s.split("\n").flatMap((s) => s.split(" ")))
  .map((p) => {
    return p.reduce((o, el) => {
      const [k, v] = el.split(":");

      return { ...o, [k]: v };
    }, {});
  });

const parseNumber = (s: string) => {
  const n = parseInt(s);

  if (isNaN(n)) {
    throw new Error(`${n} is not a number`);
  }

  return n;
};

type Validator = (a: string) => boolean;
const validators: Record<string, Validator[]> = {
  byr: [
    (val) => val.length === 4,
    (val) => {
      const n = parseNumber(val);
      return n >= 1920 && n <= 2002;
    },
  ],
  iyr: [
    (val) => val.length === 4,
    (val) => {
      const n = parseNumber(val);
      return n >= 2010 && n <= 2020;
    },
  ],
  eyr: [
    (val) => val.length === 4,
    (val) => {
      const n = parseNumber(val);
      return n >= 2020 && n <= 2030;
    },
  ],
  hgt: [
    (val) => {
      const [valN, valU] = [
        val.substr(0, val.length - 2),
        val.substr(val.length - 2, 2),
      ];

      if (!["cm", "in"].includes(valU)) {
        return false;
      }

      const n = parseNumber(valN);

      if (valU === "cm") {
        return n >= 150 && n <= 193;
      }

      if (valU === "in") {
        return n >= 59 && n <= 76;
      }

      return false;
    },
  ],
  hcl: [(val) => /#[0-9a-f]{6}/.test(val)],
  ecl: [
    (val) => ["amb", "blu", "brn", "gry", "grn", "hzl", "oth"].includes(val),
  ],
  pid: [(val) => val.length === 9, (val) => !!parseNumber(val)],
};

const valid = passports.filter((passport, i) =>
  Object.entries(validators).every(([key, vs]) => {
    try {
      return vs.every((v) => v(passport[key]));
    } catch (err) {
      return false;
    }
  })
);

console.log(valid.length);
