import { readFileSync } from "fs";
import { join } from "path";

class Node {
    constructor(public name: string) {}
}

class Edge<N, T> {
    constructor(public from: N, public to: N, public size: T) {}
}

class Graph<N extends Node, E> {
    private nodes: Map<string, N> = new Map();
    private edges: Set<Edge<N, E>> = new Set();

    constructor(private nodeFactory: (name: string) => N) {}

    public getNode(name: string) {
        if (!this.nodes.has(name)) {
            this.nodes.set(name, this.nodeFactory(name));
        }

        return this.nodes.get(name)!;
    }

    public createNode(name: string) {
        return this.getNode(name);
    }

    public createEdge(from: N, to: N, size: E) {
        this.edges.add(new Edge(from, to, size));
    }

    public findEdgesFromNode(node: N) {
        return Array.from(this.edges).filter(
            (edge) => edge.from.name === node.name
        );
    }

    public getConnected(node: N) {
        return this.findEdgesFromNode(node).map((edge) => ({
            node: this.getNode(edge.to.name),
            size: edge.size,
        }));
    }

    public reduceNodes<T>(from: N, acc: T, f: (acc: T, node: N) => T): T {
        return this.getConnected(from).reduce(
            (out, n) => this.reduceNodes(n.node, out, f),
            f(acc, from)
        );
    }

    public reduceEdges = (
        node: N,
        depthSeed: E,
        depthReducer: (a: E, b: E) => E,
        breadthSeed: E,
        breadthReducer: (a: E, b: E) => E
    ): E => {
        const edges = this.findEdgesFromNode(node);
        if (edges.length === 0) {
            return depthSeed;
        }

        const fromHere = edges.map((edge) => {
            return this.reduceEdges(
                edge.to,
                depthReducer(edge.size, depthSeed),
                depthReducer,
                breadthSeed,
                breadthReducer
            );
        });

        return breadthReducer(
            depthSeed,
            fromHere.reduce(breadthReducer, breadthSeed)
        );
    };
}

interface ContainSpec {
    count: number;
    color: string;
}

class Rule {
    constructor(public color: string, public contains: ContainSpec[]) {}
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

const graph = new Graph<Node, number>((name) => new Node(name));
rules.forEach((rule) => {
    const container = graph.getNode(rule.color);
    rule.contains.forEach((child) => {
        graph.createEdge(container, graph.getNode(child.color), child.count);
    });
});

const shinyGold = graph.getNode("shiny gold");
console.log(
    graph.reduceEdges(
        shinyGold,
        1,
        (x, y) => x * y,
        0,
        (x, y) => x + y
    ) - 1
);
