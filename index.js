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
    

    encontrarRelacionamentosProximosComLimite(ator1, ator2, limite = 8) {
        const visitados = {};
        const fila = [[ator1]];
    
        const caminhosEncontrados = [];
    
        while (fila.length > 0) {
            const caminho = fila.shift();
            const ultimoVertice = caminho[caminho.length - 1];
    
            // Se o comprimento do caminho excede o limite, não continuamos
            if (caminho.length > limite + 1) {
                continue;
            }
    
            if (ultimoVertice === ator2) {
                caminhosEncontrados.push(caminho);
                //console.log("\nCAMINHO: " + caminho);
            }
    
            // Marcar o último vértice como visitado
            visitados[ultimoVertice] = true;
    
            for (let vizinho in this.vertices[ultimoVertice]) {
                // Permitir revisitar o ator2, mas não ator1
                if (!visitados[vizinho] || vizinho === ator2) {
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

    console.log(`Número de atores: ${actors.length}`);

    const relaci8 = grafo.encontrarRelacionamentosProximosComLimite(ator1, ator2, 8);
    console.log(relaci8);

    console.log("QUANTIDADE DE RESULTADOS: "+relaci8.length)
});
