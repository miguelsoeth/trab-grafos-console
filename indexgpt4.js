const { Worker, isMainThread, parentPort } = require('worker_threads');
const fs = require('fs');

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

    // Multithreaded version of findPaths
    async findPaths(src, dst, maxDepth = 9) {
        const initialNeighbors = Object.keys(this.vertices[src]);
        const caminhosEncontrados = [];

        // Helper function to run workers and collect their results
        const runWorker = (src, dst, maxDepth, initialNeighbor) => {
            return new Promise((resolve, reject) => {
                const worker = new Worker(__filename, {
                    workerData: {
                        vertices: this.vertices,
                        src: initialNeighbor,
                        dst,
                        maxDepth
                    }
                });

                worker.on('message', resolve);
                worker.on('error', reject);
                worker.on('exit', (code) => {
                    if (code !== 0) {
                        reject(new Error(`Worker stopped with exit code ${code}`));
                    }
                });
            });
        };

        const promises = initialNeighbors.map(neighbor => runWorker(src, dst, maxDepth, neighbor));
        const results = await Promise.all(promises);

        results.forEach(result => caminhosEncontrados.push(...result));
        return caminhosEncontrados;
    }
}

function mergeGraphs(graph1, graph2) {
    const mergedGraph = new Grafo(); // Create a new instance of Grafo for the merged graph

    // Merge vertices and edges from graph1
    for (const vertex in graph1.vertices) {
        mergedGraph.adicionarVertice(vertex);
        for (const neighbor in graph1.vertices[vertex]) {
            mergedGraph.adicionarVertice(neighbor);
            mergedGraph.adicionarAresta(vertex, neighbor);
        }
    }

    // Merge vertices and edges from graph2
    for (const vertex in graph2.vertices) {
        if (!mergedGraph.vertices[vertex]) {
            mergedGraph.adicionarVertice(vertex);
        }
        for (const neighbor in graph2.vertices[vertex]) {
            if (!mergedGraph.vertices[neighbor]) {
                mergedGraph.adicionarVertice(neighbor);
            }
            mergedGraph.adicionarAresta(vertex, neighbor);
        }
    }

    return mergedGraph;
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

// Function to load the JSON file
fs.readFile('./latest_movies.json', 'utf8', async (err, data) => {
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

    const ator1 = "John Cena";
    const ator2 = "Will Poulter";

    console.log("Grafo inicial:");
    console.log(`Número de atores: ${actors.length}`);
    console.log(`Número de filmes: ${filmes.length}`);
    console.log(`Número total de vértices (VIA MÉTODO): ${grafo.contarVertices()}`);
    console.log("+++++++++++++++++++++++++++++");
    console.log(`No grafo encontrar ${ator1}-${ator2}: todos caminhos com até 8 de profundidade:`);

    // Find all paths between ator1 and ator2 using multithreading
    const result = await grafo.findPaths(ator1, ator2, 8);
    console.log("QNTD: " + result.length);
    saveResultToFile(result.map(caminho => caminho.join(' -> ')));
});
