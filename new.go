package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
)

// Movie represents a movie with its title and cast.
type Movie struct {
	Title string   `json:"title"`
	Cast  []string `json:"cast"`
}

// Graph represents a graph using an adjacency list.
type Graph struct {
	AdjacencyList map[string][]string
}

// NewGraph initializes a new graph.
func NewGraph() *Graph {
	return &Graph{AdjacencyList: make(map[string][]string)}
}

// AddVertex adds a vertex to the graph.
func (g *Graph) AddVertex(vertex string) {
	if _, exists := g.AdjacencyList[vertex]; !exists {
		g.AdjacencyList[vertex] = []string{}
	}
}

// AddEdge adds an edge between two vertices.
func (g *Graph) AddEdge(vertex1, vertex2 string) {
	g.AdjacencyList[vertex1] = append(g.AdjacencyList[vertex1], vertex2)
	g.AdjacencyList[vertex2] = append(g.AdjacencyList[vertex2], vertex1)
}

// Size returns the number of vertices in the graph.
func (g *Graph) Size() int {
	return len(g.AdjacencyList)
}

// FindShortestPaths finds the shortest paths between two actors.
func (g *Graph) FindShortestPaths(actor1, actor2 string) {
	queue := [][]string{{actor1}}
	visited := map[string]bool{actor1: true}
	var paths [][]string

	for len(queue) > 0 {
		currentPath := queue[0]
		queue = queue[1:]
		currentVertex := currentPath[len(currentPath)-1]

		// Limit path length to 8 edges (9 vertices)
		if len(currentPath) > 9 {
			continue
		}

		if currentVertex == actor2 {
			paths = append(paths, currentPath)
			fmt.Println(len(paths))
			continue
		}

		for _, neighbor := range g.AdjacencyList[currentVertex] {
			if !visited[neighbor] || len(currentPath) < 9 {
				newPath := append([]string{}, currentPath...) // Copy currentPath
				newPath = append(newPath, neighbor)
				queue = append(queue, newPath)

				if len(newPath) < 9 {
					visited[neighbor] = true
				}
			}
		}
	}

	if len(paths) > 0 {
		fmt.Printf("Shortest paths between %s and %s:\n", actor1, actor2)
		fmt.Println(len(paths))
		// for _, path := range paths {
		// 	fmt.Println(path)
		// }
	} else {
		fmt.Printf("No relationship between %s and %s\n", actor1, actor2)
	}
}

func main() {
	data, err := ioutil.ReadFile("latest_movies.json")
	if err != nil {
		log.Fatalf("Error reading the file: %v", err)
	}

	var movies []Movie
	if err := json.Unmarshal(data, &movies); err != nil {
		log.Fatalf("Error parsing JSON: %v", err)
	}

	graph := NewGraph()

	for _, movie := range movies {
		graph.AddVertex(movie.Title)
		for _, actor := range movie.Cast {
			graph.AddVertex(actor)
			graph.AddEdge(movie.Title, actor)
		}
	}

	actor1 := "Zendaya"
	actor2 := "Shia LaBeouf"
	fmt.Printf("Graph size: %d\n", graph.Size())
	graph.FindShortestPaths(actor1, actor2)
}
