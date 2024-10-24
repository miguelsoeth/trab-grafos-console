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

    calcularFatorDeRamificacao() {
        const totalArestas = Object.values(this.vertices).reduce((acc, vizinhos) => acc + Object.keys(vizinhos).length, 0);
        const totalVertices = Object.keys(this.vertices).length;

        // O fator de ramificação é o número total de arestas dividido pelo número de vértices
        return totalVertices === 0 ? 0 : totalArestas / (totalVertices * 2);
    }

    calcularProfundidade() {
        const visitado = new Set();
        let profundidadeMaxima = 0;
    
        const dfs = (vertice, profundidade) => {
            visitado.add(vertice);
            profundidadeMaxima = Math.max(profundidadeMaxima, profundidade);
    
            // Use Object.keys to iterate over the neighbors
            for (const vizinho of Object.keys(this.vertices[vertice])) {
                if (!visitado.has(vizinho)) {
                    dfs(vizinho, profundidade + 1);
                }
            }
        };
    
        // Inicia a DFS para cada vértice (caso o grafo não seja conectado)
        for (const vertice in this.vertices) {
            if (!visitado.has(vertice)) {
                dfs(vertice, 0);
            }
        }
    
        return profundidadeMaxima;
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
                }
            }
        }

        return subgrafo;
    }

    encontrarRelacionamentoMaisProximo(ator1, ator2) {
        const visitados = {};
        const fila = [[ator1]];

        visitados[ator1] = true;

        while (fila.length > 0) {
            const caminho = fila.shift();
            const ultimoVertice = caminho[caminho.length - 1];

            if (ultimoVertice === ator2) {
                return caminho;
            }

            for (let vizinho in this.vertices[ultimoVertice]) {
                if (!visitados[vizinho]) {
                    visitados[vizinho] = true;
                    const novoCaminho = [...caminho, vizinho];
                    fila.push(novoCaminho);
                }
            }
        }
        return null;
    }

    getAllActorsInGraph(actors) {
        const actorsInGraph = [];

        for (const vertice in this.vertices) {
            if (actors.includes(vertice)) {
                actorsInGraph.push(vertice);
            }
        }

        return actorsInGraph;
    }

    getAllMoviesInGraph(movies) {
        const moviesInGraph = [];
        const movieSet = [];
        movies.forEach(element => {            
            movieSet.push(element.title);
        });

        for (const vertice in this.vertices) {
            if (movieSet.includes(vertice)) {
                moviesInGraph.push(vertice);
            }
        }

        return moviesInGraph;
    }

    encontrarTodosOsCaminhos(ator1, ator2, maxTamanho) {
        const fila = [[ator1]];
        const caminhos = [];
    
        while (fila.length > 0) {
            const caminho = fila.shift();
            const ultimoVertice = caminho[caminho.length - 1];
    
            if (ultimoVertice === ator2 && caminho.length <= maxTamanho) {
                caminhos.push(caminho);
                continue;
            }
    
            // Se o caminho já excede o tamanho máximo, não continue
            if (caminho.length >= maxTamanho) {
                continue;
            }
    
            // Adiciona todos os vizinhos à fila para continuar a busca
            for (const vizinho in this.vertices[ultimoVertice]) {
                const novoCaminho = [...caminho, vizinho]; // Cria um novo caminho
                fila.push(novoCaminho); // Adiciona o novo caminho à fila
            }
        }
    
        return caminhos; // Retorna todos os caminhos encontrados
    }

    encontrarRelacionamentosProximosSemRepetirAtores(ator1, ator2, actors, limite = 8) {
        const fila = [[ator1]];

        const actorsSet = new Set(actors);
    
        const caminhosEncontrados = [];
    
        while (fila.length > 0) {
            const caminho = fila.shift();
            const ultimoVertice = caminho[caminho.length - 1];

            if (caminho.length > limite + 1) {
                continue;
            }
    
            if (ultimoVertice === ator2) {
                caminhosEncontrados.push(caminho);
                console.log("\nCAMINHO: " + caminhosEncontrados.length);
            }
            else {
                //process.stdout.write(".");
            }

            for (let vizinho in this.vertices[ultimoVertice]) {
                // Gerar caminho caso o vértice não seja um ator OU no caminho o ator não estiver incluído
                if (!actorsSet.has(vizinho) || !caminho.includes(vizinho)) {
                    const novoCaminho = [...caminho, vizinho];
                    fila.push(novoCaminho);
                }
            }            
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

// Função para carregar o arquivo JSON
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
    console.log(`Número de atores: ${grafo.getAllActorsInGraph(actors).length}`);
    console.log(`Número de filmes: ${grafo.getAllMoviesInGraph(filmes).length}`);
    console.log(`Número total de vértices no grafo completo: ${filmes.length + actors.length}`);
    console.log(`Fator de ramificação: ${grafo.calcularFatorDeRamificacao()}`);
    console.log(`Profundidade: ${grafo.calcularProfundidade()}`);
    console.log("+++++++++++++++++++++++++++++");
    console.log(`Subgrafo com profundidade 8 a partir de ${ator1}:`);
    let subgraph = grafo.extrairSubgrafo(ator1, 8);
    console.log(`Fator de ramificação: ${subgraph.calcularFatorDeRamificacao()}`);
    console.log(`Profundidade: ${subgraph.calcularProfundidade()}`);
    const actorsInSubgraph = subgraph.getAllActorsInGraph(actors);
    const moviesInSubgraph = subgraph.getAllMoviesInGraph(filmes);
    console.log("QUANTIDADE DE ATORES NO SUBGRAFO: "+actorsInSubgraph.length);
    console.log("QUANTIDADE DE FILMES NO SUBGRAFO: "+moviesInSubgraph.length);
    console.log(`Número total de vértices no subgrafo: ${actorsInSubgraph.length + moviesInSubgraph.length}`);
    console.log("+++++++++++++++++++++++++++++");
    console.log(`No subgrafo de ${ator1}, encontrar todos caminhos com até 8 de profundidade:`);
    const paths = subgraph.encontrarRelacionamentosProximosSemRepetirAtores(ator1, ator2, subgraph.getAllActorsInGraph(actors), 8);
    console.log(`Qntd de caminhos encontrados: ${paths.length}`);
    saveResultToFile(paths);

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
