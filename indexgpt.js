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
    findPaths(src, dst) {
        let q = []; // Queue to store paths
        let path = [src];
        q.push([...path]);

        while (q.length) {
            path = q.shift();
            let last = path[path.length - 1];

            // If last vertex is the desired destination then print the path
            if (last === dst) {
                //this.printPath(path);
            }
            
            console.log(q.length);

            // Traverse to all the nodes connected to current vertex and push new path to queue
            for (let neighbor in this.vertices[last]) {
                if (this.isNotVisited(neighbor, path)) {
                    let newPath = [...path, neighbor];
                    q.push(newPath);
                }
            }
        }
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
    grafo.findPaths(ator1, ator2);
});

function saveResultToFile(dataToSave) {
    const stringData = dataToSave.join('\n');

    fs.writeFile('output.txt', stringData, (err) => {
        if (err) {
            console.error('Error writing to file:', err);
        } else {
            console.log('Data saved to output.txt');
        }
    });
}
