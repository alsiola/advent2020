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

const program = new Program(cmds);

while (true) {
    program.step();
}
