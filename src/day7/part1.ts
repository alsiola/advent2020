import { readFileSync } from "fs";
import { join } from "path";

interface ContainSpec {
    count: number;
    color: string;
}

class Rule {
    constructor(public color: string, public contains: ContainSpec[]) {}
}

class Node {
    constructor(public name: string) {}
}

class Edge {
    constructor(public from: Node, public to: Node) {}
}

class Graph {
    private nodes: Map<string, Node> = new Map();
    private edges: Set<Edge> = new Set();

    public getNode(name: string) {
        if (!this.nodes.has(name)) {
            this.nodes.set(name, new Node(name));
        }

        return this.nodes.get(name)!;
    }

    public createNode(name: string) {
        return this.getNode(name);
    }

    public createEdge(from: Node, to: Node) {
        this.edges.add(new Edge(from, to));
    }

    public findEdgesFromNode(node: Node) {
        return Array.from(this.edges).filter(
            (edge) => edge.from.name === node.name
        );
    }

    public getConnected(node: Node) {
        return this.findEdgesFromNode(node).map((edge) =>
            this.getNode(edge.to.name)
        );
    }

    public reduceNodes<T>(from: Node, acc: T, f: (acc: T, node: Node) => T): T {
        return this.getConnected(from).reduce(
            (out, n) => this.reduceNodes(n, out, f),
            f(acc, from)
        );
    }
}

const colorR = /([0-9]+)\s([a-z\s]+)\sbags?\.?/;

const getBagColour = (bag: string): ContainSpec | undefined => {
    const matches = colorR.exec(bag);
    if (!matches) {
        return;
    }

    return {
        count: parseInt(matches[1], 10),
        color: matches[2],
    };
};

const rules = readFileSync(join(__dirname, "input.txt"))
    .toString()
    .split("\n")
    .map((s) => s.split("contain"))
    .map(
        ([thisBag, contains]) =>
            new Rule(
                thisBag.substring(0, thisBag.length - 6),
                contains
                    .split(",")
                    .map(getBagColour)
                    .filter((c) => typeof c !== "undefined") as ContainSpec[]
            )
    );

const graph = new Graph();
rules.forEach((rule) => {
    const container = graph.getNode(rule.color);
    rule.contains.forEach((child) => {
        graph.createEdge(graph.getNode(child.color), container);
    });
});

const shinyGold = graph.getNode("shiny gold");
console.log(
    graph.reduceNodes(shinyGold, new Set(), (o, x) => o.add(x.name)).size
);
