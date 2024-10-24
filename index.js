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

    // New method to extract subgraph with max depth 8
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

    // encontrarRelacionamentosProximosComLimite(ator1, ator2, limite = 8) {
    //     const visitados = new Set();
    //     const fila = [[ator1]];
        
    //     const caminhosEncontrados = [];
    
    //     while (fila.length > 0) {
    //         const caminho = fila.shift();
    //         const ultimoVertice = caminho[caminho.length - 1];
    
    //         // Se o comprimento do caminho excede o limite, não continuamos
    //         if (caminho.length > limite + 1) {
    //             continue;
    //         }
    
    //         if (ultimoVertice === ator2) {
    //             caminhosEncontrados.push(caminho);
    //         }
    
    //         // Marcar o último vértice como visitado
    //         visitados.add(ultimoVertice);
    
    //         for (let vizinho in this.vertices[ultimoVertice]) {
    //             // Permitir revisitar o ator2, mas não ator1 e não o último vértice
    //             if (!visitados.has(vizinho) || vizinho === ator2) {
    //                 const novoCaminho = [...caminho, vizinho];
    //                 fila.push(novoCaminho);
    //             }
    //         }
    
    //         // Desmarcar o último vértice para permitir novos caminhos
    //         visitados.delete(ultimoVertice);
    //     }
        
    //     const uniquePaths = Array.from(new Set(caminhosEncontrados.map(JSON.stringify))).map(JSON.parse);
    //     return caminhosEncontrados;
    // }

    encontrarRelacionamentosProximosSemRepetir(ator1, ator2, limite = 8) {
        const visitados = {};
        const fila = [[ator1]];
    
        const caminhosEncontrados = [];
    
        while (fila.length > 0) {
            const caminho = fila.shift();
            const ultimoVertice = caminho[caminho.length - 1];
    
            if (caminho.length > limite + 1) {
                continue;
            }
    
            if (ultimoVertice === ator2) {
                caminhosEncontrados.push(caminho);
            }
    
            visitados[ultimoVertice] = true;
    
            for (let vizinho in this.vertices[ultimoVertice]) {
                // Permitir revisitar o ator2, mas não ator1
                if (!visitados[vizinho]) {
                    const novoCaminho = [...caminho, vizinho];
                    fila.push(novoCaminho);
                }
            }
    
            // Desmarcar o último vértice como visitado para explorar novos caminhos
            //visitados[ultimoVertice] = false;


            //console.log(visitados);
        }
    
        return caminhosEncontrados;
    }

    encontrarRelacionamentosProximosSemRepetirAtorInicialEFinal(ator1, ator2, limite = 8) {
        const visitados = {};
        const fila = [[ator1]];
    
        const caminhosEncontrados = [];
    
        while (fila.length > 0) {
            const caminho = fila.shift();
            const ultimoVertice = caminho[caminho.length - 1];
    
            if (caminho.length > limite + 1) {
                continue;
            }
    
            if (ultimoVertice === ator2) {
                caminhosEncontrados.push(caminho);
            }
    
    
            for (let vizinho in this.vertices[ultimoVertice]) {
                if (vizinho === ator2 && caminho.length > 1) {
                    const novoCaminho = [...caminho, vizinho];
                    fila.push(novoCaminho);
                } else if (vizinho !== ator1) {
                    // Impedir voltar ao ator1 e não repetir vizinhos já no caminho
                    const novoCaminho = [...caminho, vizinho];
                    fila.push(novoCaminho);
                }
            }
        }
    
        return caminhosEncontrados;
    }

    encontrarRelacionamentosProximosRepeticaoLivre(ator1, ator2, limite = 8) {
        const fila = [[ator1]];
    
        const caminhosEncontrados = [];
    
        while (fila.length > 0) {
            const caminho = fila.shift();
            const ultimoVertice = caminho[caminho.length - 1];
    
            if (caminho.length > limite + 1) {
                continue;
            }
    
            if (ultimoVertice === ator2) {
                caminhosEncontrados.push(caminho);
                console.log(caminhosEncontrados.length);
            }
            else {
                process.stdout.write(".");
            }
            

    
            for (let vizinho in this.vertices[ultimoVertice]) {
                    const novoCaminho = [...caminho, vizinho];
                    fila.push(novoCaminho);
            }
        }
    
        return caminhosEncontrados;
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
        const movieSet = new Set();
        movies.forEach(element => {            
            movieSet.add(element.title);
        });

        for (const vertice in this.vertices) {
            if (movieSet.has(vertice)) {
                moviesInGraph.push(vertice);
            }
        }

        return moviesInGraph;
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

    const ator1 = "Zendaya";
    const ator2 = "John Cena";

    console.log(`Número de atores: ${grafo.getAllActorsInGraph(actors).length}`);
    console.log(`Número de filmes: ${grafo.getAllMoviesInGraph(filmes).length}`);
    console.log(`Número total de vértices: ${filmes.length + actors.length}`);

    console.log(`Fator de ramificação: ${grafo.calcularFatorDeRamificacao()}`);
    console.log(`Profundidade: ${grafo.calcularProfundidade()}`);

    console.log("+++++++++++++++++++++++++++++");

    let subgraph = grafo.extrairSubgrafo("Zendaya", 8);
    console.log(`Fator de ramificação: ${subgraph.calcularFatorDeRamificacao()}`);
    console.log(`Profundidade: ${subgraph.calcularProfundidade()}`);

    console.log("+++++++++++++++++++++++++++++");

    const actorsInSubgraph = subgraph.getAllActorsInGraph(actors);
    const moviesInSubgraph = subgraph.getAllMoviesInGraph(filmes);
    console.log("QUANTIDADE DE ATORES NO SUBGRAFO: "+actorsInSubgraph.length);
    console.log("QUANTIDADE DE FILMES NO SUBGRAFO: "+moviesInSubgraph.length);

    const subRelation = grafo.encontrarRelacionamentoMaisProximo(ator1, ator2);
    console.log("QUANTIDADE DE CAMINHO NO SUBGRAFO: "+subRelation);

    //const relaci8 = grafo.encontrarRelacionamentosProximosSemRepetir(ator1, ator2, 8);
    //.log("QUANTIDADE DE RESULTADOS (SEM REPETIR): "+relaci8.length);

    

    //const relaci8_3 = grafo.encontrarRelacionamentosProximosSemRepetirAtores(ator1, ator2, actors, 8);
    //console.log("QUANTIDADE DE RESULTADOS (SEM REPETIR ATORES): "+relaci8_3.length);

    // const relaci8_2 = grafo.encontrarRelacionamentosProximosSemRepetirAtorInicialEFinal(ator1, ator2, 8);
    // console.log("QUANTIDADE DE RESULTADOS (SEM REPETIR ATOR FINAL E INICIAL): "+relaci8_2.length);

    // const relaci8_4 = grafo.encontrarRelacionamentosProximosRepeticaoLivre(ator1, ator2, 8);
    // console.log("QUANTIDADE DE RESULTADOS (REPETIÇÕES LIVRES): "+relaci8_4.length);

    
    
    
    
});
