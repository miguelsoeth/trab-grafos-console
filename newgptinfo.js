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

    relacionamentoMaisProximo(ator1, ator2) {
        const fila = [[ator1]]; // Fila para armazenar caminhos a serem explorados
        const visitado = new Set(); // Conjunto para rastrear vértices visitados
        visitado.add(ator1); // Marca o ator1 como visitado
        const caminhos = []; // Armazena todos os caminhos encontrados

        while (fila.length > 0) {
            const caminhoAtual = fila.shift(); // Remove o primeiro caminho da fila
            const verticeAtual = caminhoAtual[caminhoAtual.length - 1]; // Obtém o último vértice do caminho
            // Verifica se o caminho atual excede 8 arestas
            if (caminhoAtual.length > 9) {
                continue;
            }

            if (verticeAtual === ator2) {
                caminhos.push(caminhoAtual);
                console.log(caminhos.length); // Adiciona o caminho encontrado
                continue; // Continua a busca para encontrar outros caminhos
            }

            this.listaAdjacencia[verticeAtual].forEach(vizinho => {
                if (!visitado.has(vizinho) || caminhoAtual.length < 9) {
                    // Adiciona o vizinho ao caminho atual
                    const novoCaminho = [...caminhoAtual, vizinho];
                    fila.push(novoCaminho); // Adiciona o novo caminho à fila

                    // Marca o vizinho como visitado se o caminho atual não exceder 8 arestas
                    if (novoCaminho.length < 9) {
                        visitado.add(vizinho);
                    }
                }
            });
        }

        if (caminhos.length > 0) {
            console.log(`Caminhos mais curtos entre ${ator1} e ${ator2}:`);
            caminhos.forEach(caminho => {
                console.log(caminho);
            });
        } else {
            console.log('Não há relacionamento entre', ator1, 'e', ator2);
        }
    }
}

fs.readFile('./latest_movies.json', 'utf8', (err, data) => {
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

    const ator1 = "Oscar Isaac";
    const ator2 = "Vin Diesel";
    grafo.tamanho();
    grafo.relacionamentoMaisProximo(ator1, ator2);
});


