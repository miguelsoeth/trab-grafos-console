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
        let caminhosEncontrados = [];
        let q = []; // Queue to store paths
        let path = [src];
        q.push([...path]);
    
        while (q.length) {
            path = q.shift();
            let last = path[path.length - 1];
    
            // If last vertex is the desired destination then print the path
            if (last === dst) {
                //this.printPath(path);
                caminhosEncontrados.push(path);
            }

            console.log(q.length);
    
            // If the current path length exceeds maxDepth, skip further exploration
            if (path.length >= maxDepth) {
                continue; // Do not add further paths from this one
            }
    
            // Traverse to all the nodes connected to the current vertex
            for (let neighbor in this.vertices[last]) {
                if (this.isNotVisited(neighbor, path)) {
                    let newPath = [...path, neighbor];
                    q.push(newPath);
                }
            }
        }

        return caminhosEncontrados;
    }

    extrairSubgrafo(verticeInicial, profundidadeMaxima = 8) {
        const queue = [[verticeInicial, 0]];  // Tuplas [vértice, profundidade]
        const visitado = new Set([verticeInicial]);
        const subgrafo = new Grafo();  // Novo subgrafo

        subgrafo.adicionarVertice(verticeInicial);  // Adiciona o vértice inicial

        while (queue.length > 0) {
            const [verticeAtual, profundidade] = queue.shift();  // Desenfileira o primeiro vértice

            if (profundidade < profundidadeMaxima) {
                for (let vizinho of Object.keys(this.vertices[verticeAtual])) {
                    if (!visitado.has(vizinho)) {
                        visitado.add(vizinho);
                        queue.push([vizinho, profundidade + 1]);

                        // Adiciona vértice e aresta no subgrafo
                        subgrafo.adicionarVertice(vizinho);
                        subgrafo.adicionarAresta(verticeAtual, vizinho);
                    }
                    else {
                        subgrafo.adicionarAresta(verticeAtual, vizinho);
                    }
                }
            }
        }

        return subgrafo;
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

    const ator1 = "John Cena";
    const ator2 = "Will Poulter";

    console.log("Grafo inicial:");
    console.log(`Número de atores: ${actors.length}`);
    console.log(`Número de filmes: ${filmes.length}`);
    console.log(`Número total de vértices (VIA MÉTODO): ${grafo.contarVertices()}`);
    console.log("+++++++++++++++++++++++++++++");
    console.log(`No grafo encontrar ${ator1}-${ator2}: todos caminhos com até 8 de profundidade:`);

    // Find all paths between ator1 and ator2
    const subgrafo1 = grafo.extrairSubgrafo(ator1, 8);
    const subgrafo2 = grafo.extrairSubgrafo(ator2, 8);
    const mergedGraph = mergeGraphs(subgrafo1, subgrafo2);
    //console.log(mergedGraph.mostraLista());
    console.log("+++++++++++++++++++++++++++++");
    //console.log(subgrafo2.mostraLista());
    console.log(`Número total de vértices SUBGRAFO (VIA MÉTODO): ${subgrafo1.contarVertices()}`);
    const result = subgrafo1.findPaths(ator1, ator2);
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
