import { readFileSync } from "fs";
import { join } from "path";

enum Cmd {
    "acc" = "acc",
    "jmp" = "jmp",
    "nop" = "nop",
}

class Command {
    constructor(public cmd: Cmd, public val: number) {}
}

class Program {
    private state = 0;
    private where = 0;

    private hx: Set<number> = new Set();

    constructor(private cmds: Command[]) {}

    step() {
        if (this.hx.has(this.where)) {
            throw new Error(`Infinite loop, state is ${this.state}`);
        }
        this.hx.add(this.where);
        const cmd = this.cmds[this.where];

        if (!cmd) {
            return this.state;
        }

        switch (cmd.cmd) {
            case Cmd.acc:
                this.state += cmd.val;
                this.where++;
                break;
            case Cmd.jmp:
                this.where += cmd.val;
                break;
            case Cmd.nop:
                this.where++;
                break;
        }
    }

    getState() {
        return this.state;
    }
}

const cmds = readFileSync(join(__dirname, "input.txt"))
    .toString()
    .split("\n")
    .map((op) => op.split(" "))
    .map(([cmd, val]) => new Command(cmd as Cmd, parseInt(val)));

const variations = cmds
    .map((cmd, i) => {
        switch (cmd.cmd) {
            case Cmd.jmp:
                const newC = cmds.slice();
                newC[i] = { cmd: Cmd.nop, val: cmd.val };
                return newC;
            case Cmd.nop:
                const newCN = cmds.slice();
                newCN[i] = { cmd: Cmd.jmp, val: cmd.val };
                return newCN;
        }
    })
    .filter((cmds) => !!cmds) as Command[][];

variations.forEach((cmds, i) => {
    const program = new Program(cmds);
    let result;

    while (!result) {
        try {
            result = program.step();
        } catch (err) {
            break;
        }
    }

    if (result) {
        console.log(result);
    }
});
