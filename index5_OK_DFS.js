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

    bigO() {
        const fatorRamificacao = this.calcularFatorDeRamificacao();
        const profundidade = this.calcularProfundidade();
        return Math.pow(fatorRamificacao, profundidade);
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

    contarVertices() {
        return Object.keys(this.vertices).length;
    }    

    encontrarTodosCaminhos(ator1, ator2, profundidadeMaxima = 8) {
        const todosCaminhos = [];
        const caminhoAtual = [ator1];

        const dfs = (vertice, profundidade) => {
            if (profundidade > profundidadeMaxima) {
                return; // Se a profundidade máxima for alcançada, retorna
            }

            if (vertice === ator2) {
                todosCaminhos.push([...caminhoAtual]); // Armazena o caminho encontrado
                return;
            }

            for (let vizinho in this.vertices[vertice]) {
                if (!caminhoAtual.includes(vizinho)) { // Evita ciclos
                    caminhoAtual.push(vizinho); // Adiciona o vizinho ao caminho
                    dfs(vizinho, profundidade + 1); // Chama DFS recursivamente
                    caminhoAtual.pop(); // Remove o vizinho do caminho após a chamada
                }
            }
        };

        dfs(ator1, 0); // Inicia a DFS a partir do ator1
        return todosCaminhos;
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
    console.log(`Número total de vértices (VIA MÉTODO): ${grafo.contarVertices()}`);       
    console.log(`Fator de ramificação: ${grafo.calcularFatorDeRamificacao()}`);
    console.log(`Profundidade: ${grafo.calcularProfundidade()}`);
    console.log(`Big O: ${grafo.bigO()}`); 
    console.log("+++++++++++++++++++++++++++++");
    let subgraph = grafo.extrairSubgrafo(ator1, 8);
    console.log(`Subgrafo com profundidade 8 a partir de ${ator1}:`);    
    console.log("QUANTIDADE DE ATORES NO SUBGRAFO: "+subgraph.getAllActorsInGraph(actors).length);
    console.log("QUANTIDADE DE FILMES NO SUBGRAFO: "+subgraph.getAllMoviesInGraph(filmes).length);
    console.log(`Número total de vértices no subgrafo (VIA MÉTODO): ${subgraph.contarVertices()}`);
    console.log(`Fator de ramificação: ${subgraph.calcularFatorDeRamificacao()}`);
    console.log(`Profundidade: ${subgraph.calcularProfundidade()}`);
    console.log(`Big O: ${subgraph.bigO()}`);
    console.log("+++++++++++++++++++++++++++++");
    let subgraph2 = grafo.extrairSubgrafo(ator2, 8);
    console.log(`Subgrafo com profundidade 8 a partir de ${ator2}:`);    
    console.log("QUANTIDADE DE ATORES NO SUBGRAFO: "+subgraph2.getAllActorsInGraph(actors).length);
    console.log("QUANTIDADE DE FILMES NO SUBGRAFO: "+subgraph2.getAllMoviesInGraph(filmes).length);
    console.log(`Número total de vértices no subgrafo (VIA MÉTODO): ${subgraph2.contarVertices()}`);
    console.log(`Fator de ramificação: ${subgraph2.calcularFatorDeRamificacao()}`);
    console.log(`Profundidade: ${subgraph2.calcularProfundidade()}`);
    console.log(`Big O: ${subgraph2.bigO()}`);
    console.log("+++++++++++++++++++++++++++++");
    console.log(`No subgrafo de ${ator1}-${ator2}, encontrar todos caminhos com até 8 de profundidade:`);
    const todosCaminhos = grafo.encontrarTodosCaminhos(ator1, ator2, 8);
    console.log(`Caminhos encontrados entre ${ator1} e ${ator2} com até 8 de profundidade:`);
    console.log(todosCaminhos.length);
    saveResultToFile(todosCaminhos.map(caminho => caminho.join(' -> ')));
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