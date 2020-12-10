import { readFileSync } from "fs";
import { join } from "path";

const answers = readFileSync(join(__dirname, "input.txt"))
    .toString()
    .split("\n\n")
    .map((s) => s.split("\n").map((p) => p.split("")))
    .map(
        (g) =>
            Object.values(
                g.reduce(
                    (o, as) =>
                        as.reduce(
                            (oo, a) => ({
                                ...oo,
                                [a]: (oo[a] || 0) + 1,
                            }),
                            o
                        ),
                    {} as Record<string, number>
                )
            ).filter((vs) => vs === g.length).length
    )
    .reduce((a, b) => a + b, 0);

console.log(answers);
