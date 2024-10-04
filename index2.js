const fs = require('fs');

// Classe Grafo conforme o exemplo anterior
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

    gerarMermaid() {
        let mermaid = 'graph TD\n';
        let labels = {}; // Map to hold unique labels for each vertex
        let labelIndex = 0; // Counter to generate unique identifiers

        const getLabel = (vertex) => {
            if (!labels[vertex]) {
                labels[vertex] = `N${labelIndex++}`; // Generate a new label (e.g., N0, N1)
            }
            return labels[vertex];
        };

        for (let vertice in this.vertices) {
            for (let vizinho in this.vertices[vertice]) {
                const verticeLabel = getLabel(vertice);
                const vizinhoLabel = getLabel(vizinho);                
                if (verticeLabel < vizinhoLabel) {
                    mermaid += `    ${verticeLabel}["${vertice}"] --- ${vizinhoLabel}["${vizinho}"]\n`;
                }
            }
        }
        return mermaid;
    }
}

// Função para gerar o HTML com o gráfico Mermaid
function gerarHtml(mermaidGraph) {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Graph Visualization</title>
        <script type="module">
            import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs';
            mermaid.initialize({ startOnLoad: true, maxTextSize: 10000000 });
        </script>
        <style>
            .mermaid {
                overflow: auto;
                width: 100%;
                height: 100%;
                max-height: 80vh; /* Adjust the height as needed */
                transform-origin: top left; /* Set the origin for scaling */
            }
        </style>
    </head>
    <body>
        <h1>Grafo de Filmes e Atores</h1>
        <div class="mermaid" id="mermaid-graph">
            ${mermaidGraph}
        </div>

        <script>
            const mermaidDiv = document.getElementById('mermaid-graph');
            let scale = 1;

            // Function to handle mouse wheel zooming
            mermaidDiv.addEventListener('wheel', (event) => {
                event.preventDefault();
                // Adjust the zoom scale based on the wheel movement
                scale += event.deltaY * -0.01; 
                // Limit the scale range
                scale = Math.min(Math.max(0.125, scale), 4); 
                // Apply the scaling transformation
                mermaidDiv.style.transform = \`scale(\${scale})\`;
            });
        </script>
    </body>
    </html>
    `;
}


// Função para carregar o arquivo JSON
fs.readFile('./latest_movies_reduced.json', 'utf8', (err, data) => {
    if (err) {
        console.error('Erro ao ler o arquivo:', err);
        return;
    }

    // Faz o parsing do JSON
    const filmes = JSON.parse(data);

    // Inicializa o grafo
    const grafo = new Grafo();

    // Adiciona os filmes e atores ao grafo
    filmes.forEach(filme => {
        // Adiciona o filme como vértice
        grafo.adicionarVertice(filme.title);

        // Adiciona cada ator como vértice e cria uma aresta entre o ator e o filme
        filme.cast.forEach(ator => {
            grafo.adicionarVertice(ator);
            grafo.adicionarAresta(filme.title, ator);
        });
    });

    // Gera o código Mermaid
    const mermaidGraph = grafo.gerarMermaid();

    // Gera o HTML
    const htmlContent = gerarHtml(mermaidGraph);

    // Escreve o conteúdo em um arquivo HTML
    fs.writeFile('graph.html', htmlContent, (err) => {
        if (err) throw err;
        console.log('Arquivo graph.html criado com sucesso!');
    });
});
