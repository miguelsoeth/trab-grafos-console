const fs = require('fs');

class Grafo {
    constructor() {
        this.listaAdjacencia = {};
    }

    tamanho() {
        console.log(Object.keys(this.listaAdjacencia).length);
    }

    // Adiciona um vértice ao grafo
    adicionarVertice(vertice) {
        if (!this.listaAdjacencia[vertice]) {
            this.listaAdjacencia[vertice] = [];
        }
    }

    // Adiciona uma aresta entre dois vértices
    adicionarAresta(vertice1, vertice2) {
        // Para um grafo não direcionado, adicionamos ambas as arestas
        this.listaAdjacencia[vertice1].push(vertice2);
        this.listaAdjacencia[vertice2].push(vertice1);
    }

    // Exibe o grafo
    exibir() {
        for (const vertice in this.listaAdjacencia) {
            console.log(vertice, this.listaAdjacencia[vertice]);
        }
    }

    bfs(inicio) {
        const fila = [inicio]; // Fila para armazenar os vértices a serem visitados
        const visitado = {}; // Objeto para rastrear vértices visitados
        const profundidade = { [inicio]: 0 };

        // Marca o vértice de início como visitado
        visitado[inicio] = true;
        console.log('BFS começando a partir de:', inicio);

        while (fila.length > 0) {
            const verticeAtual = fila.shift(); // Remove o primeiro vértice da fila
            const nivelAtual = profundidade[verticeAtual]; // Obtém a profundidade atual
            if (nivelAtual > 8) {
                continue;
            }
            console.log(verticeAtual, nivelAtual); // Exibe o vértice atual e sua profundidade

            this.listaAdjacencia[verticeAtual].forEach(vizinho => {
                if (!visitado[vizinho]) {
                    visitado[vizinho] = true; // Marca como visitado
                    profundidade[vizinho] = nivelAtual + 1;
                    fila.push(vizinho); // Adiciona à fila
                }
            });
        }
    }
}

fs.readFile('./dummy_movies.json', 'utf8', (err, data) => {
    if (err) {
        console.error('Erro ao ler o arquivo:', err);
        return;
    }

    const filmes = JSON.parse(data);        
    const grafo = new Grafo();

    filmes.forEach(filme => {
        grafo.adicionarVertice(filme.title);
        
        filme.cast.forEach(ator => {
            grafo.adicionarVertice(ator);
            grafo.adicionarAresta(filme.title, ator);
        });
    });
    grafo.tamanho();
    //grafo.exibir();
    grafo.bfs('John Cena');
});

