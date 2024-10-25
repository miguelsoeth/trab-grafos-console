const fs = require('fs');

// Movie represents a movie with its title and cast.
class Movie {
    constructor(title, cast) {
        this.title = title;
        this.cast = cast;
    }
}

// Graph represents a graph using an adjacency list.
class Graph {
    constructor() {
        this.adjacencyList = {};
    }

    // AddVertex adds a vertex to the graph.
    addVertex(vertex) {
        if (!this.adjacencyList[vertex]) {
            this.adjacencyList[vertex] = [];
        }
    }

    // AddEdge adds an edge between two vertices.
    addEdge(vertex1, vertex2) {
        this.adjacencyList[vertex1].push(vertex2);
        this.adjacencyList[vertex2].push(vertex1);
    }

    // Size returns the number of vertices in the graph.
    size() {
        return Object.keys(this.adjacencyList).length;
    }

    // FindShortestPaths finds the shortest paths between two actors.
    findShortestPaths(actor1, actor2) {
        const queue = [[actor1]];
        const visited = { [actor1]: true };
        const paths = [];

        while (queue.length > 0) {
            const currentPath = queue.shift();
            const currentVertex = currentPath[currentPath.length - 1];

            // Limit path length to 8 edges (9 vertices)
            if (currentPath.length > 9) {
                continue;
            }

            if (currentVertex === actor2) {
                paths.push(currentPath);
                console.log(paths.length)
                continue;
            }

            for (const neighbor of this.adjacencyList[currentVertex] || []) {
                if (!visited[neighbor] || currentPath.length < 9) {
                    const newPath = [...currentPath, neighbor]; // Copy currentPath
                    queue.push(newPath);

                    if (newPath.length < 9) {
                        visited[neighbor] = true;
                    }
                }
            }
        }

        if (paths.length > 0) {
            console.log(`Shortest paths between ${actor1} and ${actor2}:`);
            console.log(paths.length);
            // Uncomment to see the paths
            // for (const path of paths) {
            //     console.log(path);
            // }
        } else {
            console.log(`No relationship between ${actor1} and ${actor2}`);
        }
    }
}

function main() {
    fs.readFile('latest_movies.json', 'utf8', (err, data) => {
        if (err) {
            console.error(`Error reading the file: ${err}`);
            return;
        }

        let movies;
        try {
            movies = JSON.parse(data);
        } catch (parseError) {
            console.error(`Error parsing JSON: ${parseError}`);
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

        const actor1 = "Zendaya";
        const actor2 = "Shia LaBeouf";
        console.log(`Graph size: ${graph.size()}`);
        graph.findShortestPaths(actor1, actor2);
    });
}

main();
