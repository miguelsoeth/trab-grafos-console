const fs = require('fs');

// Classe Grafo conforme exemplo anterior
class Grafo {
    constructor() {
        this.vertices = {};
    }

    adicionarVertice(vertice) {
        if (!this.vertices[vertice]) {
            this.vertices[vertice] = {};
        }
    }

    adicionarAresta(origem, destino) {
        if (!this.vertices[origem] || !this.vertices[destino]) {
            console.log("Vértices não existem");
            return;
        }
        this.vertices[origem][destino] = true;
        this.vertices[destino][origem] = true; // Aresta bidirecional
    }

    mostraLista() {
        for (let vertice in this.vertices) {
            let vizinhos = Object.keys(this.vertices[vertice]);
            console.log(vertice, vizinhos);
        }
    }

    contarVertices() {
        return Object.keys(this.vertices).length;
    }

    // Utility function to print the found path in graph
    printPath(path) {
        console.log(path.join("-"));
    }

    // Utility function to check if current vertex is already present in path
    isNotVisited(x, path) {
        return !path.includes(x);
    }

    // Function to find paths in the graph from source to destination
    findPaths(src, dst, maxDepth = 9) {
        const caminhosEncontrados = [];
        const q = []; // Queue to store paths
        q.push([src]); // Start with the source vertex

        let depth = 0;

        while (q.length) {
            const levelSize = q.length; // Number of paths at the current depth
            console.log(`Depth ${depth}:`);

            for (let i = 0; i < levelSize; i++) {
                const path = q.shift(); // Get the current path
                const last = path[path.length - 1]; // Get the last vertex in the path

                // If last vertex is the desired destination, add the path to results
                if (last === dst) {
                    this.printPath(path);
                    caminhosEncontrados.push(path);
                }

                // If the current path length exceeds maxDepth, skip further exploration
                if (path.length >= maxDepth) {
                    continue; // Do not add further paths from this one
                }

                // Traverse to all the nodes connected to the current vertex
                const neighbors = this.vertices[last] || [];
                for (const neighbor of neighbors) {
                    if (this.isNotVisited(neighbor, path)) {
                        const newPath = [...path, neighbor];
                        q.push(newPath);
                    }
                }
            }

            depth++; // Increment depth after processing all paths at the current level
        }

        return caminhosEncontrados;
    }
}

function getUniqueActors(movies) {
    const uniqueActors = new Set();
    movies.forEach(movie => {
        movie.cast.forEach(actor => {
            uniqueActors.add(actor);
        });
    });
    return Array.from(uniqueActors);
}

// Function to load the JSON file
fs.readFile('./latest_movies.json', 'utf8', (err, data) => {
    if (err) {
        console.error('Erro ao ler o arquivo:', err);
        return;
    }

    const filmes = JSON.parse(data);
    const actors = getUniqueActors(filmes);
    const grafo = new Grafo();

    filmes.forEach(filme => {
        grafo.adicionarVertice(filme.title);

        filme.cast.forEach(ator => {
            grafo.adicionarVertice(ator);
            grafo.adicionarAresta(filme.title, ator);
        });
    });

    const ator1 = "Tom Holland";
    const ator2 = "Emma Stone";

    console.log("Grafo inicial:");
    console.log(`Número de atores: ${actors.length}`);
    console.log(`Número de filmes: ${filmes.length}`);
    console.log(`Número total de vértices (VIA MÉTODO): ${grafo.contarVertices()}`);
    console.log("+++++++++++++++++++++++++++++");
    console.log(`No grafo encontrar ${ator1}-${ator2}: todos caminhos com até 8 de profundidade:`);

    // Find all paths between ator1 and ator2
    const result = grafo.findPaths(ator1, ator2);
    console.log("QNTD: "+result.length);
    //console.log(grafo.mostraLista());
    saveResultToFile(result.map(caminho => caminho.join(' -> ')));
});

function saveResultToFile(dataToSave) {
    const stringData = dataToSave.join('\n');

    fs.writeFile('output_gpt.txt', stringData, (err) => {
        if (err) {
            console.error('Error writing to file:', err);
        } else {
            console.log('Data saved to output_gpt.txt');
        }
    });
}
