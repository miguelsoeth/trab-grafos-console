function encontrarCaminhos(verticeInicial, verticeFinal, grafo, limite = 8) {
    const fila = [[verticeInicial]]; // Inicializa a fila com o vértice inicial
    const caminhosEncontrados = [];

    while (fila.length > 0) {
        const caminhoAtual = fila.shift(); // Remove o primeiro caminho da fila
        const ultimoVertice = caminhoAtual[caminhoAtual.length - 1]; // Último vértice do caminho atual

        // Verifica se o comprimento do caminho atual está dentro do limite
        if (caminhoAtual.length > limite + 1) {
            continue;
        }

        // Se o último vértice é o vértice final, salva o caminho
        if (ultimoVertice === verticeFinal) {
            caminhosEncontrados.push(caminhoAtual);
            console.log(`Caminho encontrado: ${caminhoAtual.join(' -> ')}`);
        }

        // Itera sobre os vizinhos do último vértice
        for (let vizinho of grafo[ultimoVertice]) {
            // Verifica se o vizinho já está no caminho atual para evitar ciclos
            if (!caminhoAtual.includes(vizinho)) {
                const novoCaminho = [...caminhoAtual, vizinho]; // Cria um novo caminho
                fila.push(novoCaminho); // Adiciona o novo caminho à fila
            }
        }
    }

    return caminhosEncontrados; // Retorna todos os caminhos encontrados
}

// Exemplo de uso
const grafo = {
    "A": ["B", "C"],
    "B": ["A", "D", "E"],
    "C": ["A", "F"],
    "D": ["B"],
    "E": ["B", "F"],
    "F": ["C", "E"],
    // Adicione mais vértices e arestas conforme necessário
};
console.log(grafo);
const caminhos = encontrarCaminhos("A", "F", grafo, 8);
console.log(`Total de caminhos encontrados: ${caminhos.length}`);
