const fs = require('fs-extra');

interface Movie {
    title: string;
    cast: string[];
}

class Graph {
    adjacencyList: Map<string, string[]>;

    constructor() {
        this.adjacencyList = new Map<string, string[]>();
    }

    // AddVertex adds a vertex to the graph.
    addVertex(vertex: string): void {
        if (!this.adjacencyList.has(vertex)) {
            this.adjacencyList.set(vertex, []);
        }
    }

    // AddEdge adds an edge between two vertices.
    addEdge(vertex1: string, vertex2: string): void {
        if (!this.adjacencyList.has(vertex1)) this.addVertex(vertex1);
        if (!this.adjacencyList.has(vertex2)) this.addVertex(vertex2);
        this.adjacencyList.get(vertex1)?.push(vertex2);
        this.adjacencyList.get(vertex2)?.push(vertex1);
    }

    // Size returns the number of vertices in the graph.
    size(): number {
        return this.adjacencyList.size;
    }

    // FindShortestPaths finds the shortest paths between two actors.
    findShortestPaths(actor1: string, actor2: string): string[][] {
        const queue: string[][] = [[actor1]];
        const visited = new Set<string>([actor1]);
        const paths: string[][] = [];

        while (queue.length > 0) {
            const currentPath = queue.shift()!;
            const currentVertex = currentPath[currentPath.length - 1];

            // Limit path length to 8 edges (9 vertices)
            if (currentPath.length > 9) continue;

            if (currentVertex === actor2) {
                paths.push([...currentPath]);
                console.log(paths.length);
                continue;
            }

            const neighbors = this.adjacencyList.get(currentVertex) || [];
            for (const neighbor of neighbors) {
                if (!currentPath.includes(neighbor)) {
                    const newPath = [...currentPath, neighbor];
                    queue.push(newPath);

                    if (!visited.has(neighbor) && newPath.length < 9) {
                        visited.add(neighbor);
                    }
                }
            }
        }

        if (paths.length > 0) {
            console.log(`Shortest paths between ${actor1} and ${actor2}:`);
            console.log(paths.length);
            return paths;
        } else {
            console.log(`No relationship between ${actor1} and ${actor2}`);
            return paths;
        }
    }
}

// Save result to a file
async function saveResultToFile(dataToSave: string[][]): Promise<void> {
    const filePath = './output_csharp.txt';
    const lines = dataToSave.map(list => list.join(', '));

    try {
        await fs.writeFile(filePath, lines.join('\n'), 'utf-8');
        console.log(`Data saved to ${filePath}`);
    } catch (error) {
        console.error(`Error writing to file: ${error}`);
    }
}

async function main() {
    let jsonData: string;
    try {
        jsonData = await fs.readFile('./latest_movies.json', 'utf-8');
    } catch (error) {
        console.error(`Error reading JSON file: ${error}`);
        return;
    }

    let movies: Movie[];
    try {
        movies = JSON.parse(jsonData) as Movie[];
    } catch (error) {
        console.error(`Error parsing JSON: ${error}`);
        return;
    }

    const graph = new Graph();

    for (const movie of movies) {
        graph.addVertex(movie.title);
        for (const actor of movie.cast) {
            graph.addVertex(actor);
            graph.addEdge(movie.title, actor);
        }
    }

    const actor1 = 'John Cena';
    const actor2 = 'Will Poulter';
    console.log(`Graph size: ${graph.size()}`);
    const result = graph.findShortestPaths(actor1, actor2);
    await saveResultToFile(result);
}

main().catch(console.error);
