package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"os"
)

type Graph struct {
	vertices map[string]map[string]bool
}

func NewGraph() *Graph {
	return &Graph{vertices: make(map[string]map[string]bool)}
}

func (g *Graph) AddVertex(vertex string) {
	if _, exists := g.vertices[vertex]; !exists {
		g.vertices[vertex] = make(map[string]bool)
	}
}

func (g *Graph) AddEdge(origin, destination string) {
	if _, exists := g.vertices[origin]; !exists || !exists(g.vertices, destination) {
		fmt.Println("Vertices não existem")
		return
	}
	g.vertices[origin][destination] = true
	g.vertices[destination][origin] = true // Aresta bidirecional
}

func (g *Graph) ShowList() {
	for vertex, neighbors := range g.vertices {
		fmt.Println(vertex, getKeys(neighbors))
	}
}

func (g *Graph) CountVertices() int {
	return len(g.vertices)
}

func (g *Graph) FindPaths(src, dst string, maxDepth int) [][]string {
	var foundPaths [][]string
	q := [][]string{{src}}

	for len(q) > 0 {
		path := q[0]
		q = q[1:]

		last := path[len(path)-1]
		if last == dst {
			foundPaths = append(foundPaths, path)
		}

		if len(path) >= maxDepth {
			continue // Skip further exploration
		}

		for neighbor := range g.vertices[last] {
			if isNotVisited(neighbor, path) {
				newPath := append([]string{}, path...)
				newPath = append(newPath, neighbor)
				q = append(q, newPath)
			}
		}
	}

	return foundPaths
}

func isNotVisited(vertex string, path []string) bool {
	for _, p := range path {
		if p == vertex {
			return false
		}
	}
	return true
}

func (g *Graph) ExtractSubgraph(startVertex string, maxDepth int) *Graph {
	queue := [][]string{{startVertex, "0"}} // Store vertex with depth
	visited := make(map[string]bool)
	subgraph := NewGraph()

	subgraph.AddVertex(startVertex)
	visited[startVertex] = true

	for len(queue) > 0 {
		current := queue[0]
		queue = queue[1:]
		vertex := current[0]
		depth := current[1]

		if depthInt(depth) < maxDepth {
			for neighbor := range g.vertices[vertex] {
				if !visited[neighbor] {
					visited[neighbor] = true
					queue = append(queue, []string{neighbor, fmt.Sprint(depthInt(depth) + 1)})
					subgraph.AddVertex(neighbor)
					subgraph.AddEdge(vertex, neighbor)
				}
			}
		}
	}

	return subgraph
}

func MergeGraphs(graph1, graph2 *Graph) *Graph {
	mergedGraph := NewGraph()

	for vertex := range graph1.vertices {
		mergedGraph.AddVertex(vertex)
		for neighbor := range graph1.vertices[vertex] {
			mergedGraph.AddVertex(neighbor)
			mergedGraph.AddEdge(vertex, neighbor)
		}
	}

	for vertex := range graph2.vertices {
		mergedGraph.AddVertex(vertex)
		for neighbor := range graph2.vertices[vertex] {
			mergedGraph.AddVertex(neighbor)
			mergedGraph.AddEdge(vertex, neighbor)
		}
	}

	return mergedGraph
}

func getKeys(m map[string]bool) []string {
	keys := make([]string, 0, len(m))
	for k := range m {
		keys = append(keys, k)
	}
	return keys
}

func loadMovies(filename string) ([]Movie, error) {
	data, err := ioutil.ReadFile(filename)
	if err != nil {
		return nil, err
	}

	var movies []Movie
	if err := json.Unmarshal(data, &movies); err != nil {
		return nil, err
	}

	return movies, nil
}

type Movie struct {
	Title string   `json:"title"`
	Cast  []string `json:"cast"`
}

func main() {
	movies, err := loadMovies("latest_movies.json")
	if err != nil {
		fmt.Println("Erro ao ler o arquivo:", err)
		return
	}

	graph := NewGraph()

	for _, movie := range movies {
		graph.AddVertex(movie.Title)
		for _, actor := range movie.Cast {
			graph.AddVertex(actor)
			graph.AddEdge(movie.Title, actor)
		}
	}

	actor1 := "John Cena"
	actor2 := "Will Poulter"

	subgraph1 := graph.ExtractSubgraph(actor1, 8)
	subgraph2 := graph.ExtractSubgraph(actor2, 8)
	mergedGraph := MergeGraphs(subgraph1, subgraph2)

	fmt.Printf("Número total de vértices SUBGRAFO (VIA MÉTODO): %d\n", subgraph1.CountVertices())

	result := subgraph1.FindPaths(actor1, actor2, 8)
	fmt.Printf("QNTD: %d\n", len(result))

	saveResults(result)
}

func saveResults(data [][]string) {
	file, err := os.Create("output_gpt.txt")
	if err != nil {
		fmt.Println("Error writing to file:", err)
		return
	}
	defer file.Close()

	for _, path := range data {
		_, err := file.WriteString(fmt.Sprintf("%s\n", join(path, " -> ")))
		if err != nil {
			fmt.Println("Error writing to file:", err)
		}
	}

	fmt.Println("Data saved to output_gpt.txt")
}

func join(path []string, sep string) string {
	return fmt.Sprintf(strings.Join(path, sep))
}

func depthInt(s string) int {
	depth, err := strconv.Atoi(s)
	if err != nil {
		return 0
	}
	return depth
}
