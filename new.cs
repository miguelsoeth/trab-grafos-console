using System;
using System.Collections.Generic;
using System.IO;
using Newtonsoft.Json;

// Movie represents a movie with its title and cast.
public class Movie
{
    public string Title { get; set; }
    public List<string> Cast { get; set; }
}

// Graph represents a graph using an adjacency list.
public class Graph
{
    public Dictionary<string, List<string>> AdjacencyList { get; private set; }

    public Graph()
    {
        AdjacencyList = new Dictionary<string, List<string>>();
    }

    // AddVertex adds a vertex to the graph.
    public void AddVertex(string vertex)
    {
        if (!AdjacencyList.ContainsKey(vertex))
        {
            AdjacencyList[vertex] = new List<string>();
        }
    }

    // AddEdge adds an edge between two vertices.
    public void AddEdge(string vertex1, string vertex2)
    {
        if (!AdjacencyList.ContainsKey(vertex1)) AddVertex(vertex1);
        if (!AdjacencyList.ContainsKey(vertex2)) AddVertex(vertex2);
        AdjacencyList[vertex1].Add(vertex2);
        AdjacencyList[vertex2].Add(vertex1);
    }

    // Size returns the number of vertices in the graph.
    public int Size()
    {
        return AdjacencyList.Count;
    }

    // FindShortestPaths finds the shortest paths between two actors.
    public void FindShortestPaths(string actor1, string actor2)
    {
        var queue = new Queue<List<string>>();
        queue.Enqueue(new List<string> { actor1 });
        var visited = new HashSet<string> { actor1 };
        var paths = new List<List<string>>();

        while (queue.Count > 0)
        {
            var currentPath = queue.Dequeue();
            var currentVertex = currentPath[^1];

            // Limit path length to 8 edges (9 vertices)
            if (currentPath.Count > 9)
                continue;

            if (currentVertex == actor2)
            {
                paths.Add(new List<string>(currentPath));
                Console.WriteLine(paths.Count);
                continue;
            }

            foreach (var neighbor in AdjacencyList[currentVertex])
            {
                if (!visited.Contains(neighbor) || currentPath.Count < 9)
                {
                    var newPath = new List<string>(currentPath) { neighbor };
                    queue.Enqueue(newPath);

                    if (newPath.Count < 9)
                    {
                        visited.Add(neighbor);
                    }
                }
            }
        }

        if (paths.Count > 0)
        {
            Console.WriteLine($"Shortest paths between {actor1} and {actor2}:");
            Console.WriteLine(paths.Count);
            // foreach (var path in paths)
            // {
            //     Console.WriteLine(string.Join(" -> ", path));
            // }
        }
        else
        {
            Console.WriteLine($"No relationship between {actor1} and {actor2}");
        }
    }
}

class Program
{
    static void Main()
    {
        var jsonData = File.ReadAllText("latest_movies.json");

        List<Movie> movies;
        try
        {
            movies = JsonConvert.DeserializeObject<List<Movie>>(jsonData);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error parsing JSON: {ex.Message}");
            return;
        }

        var graph = new Graph();

        foreach (var movie in movies)
        {
            graph.AddVertex(movie.Title);
            foreach (var actor in movie.Cast)
            {
                graph.AddVertex(actor);
                graph.AddEdge(movie.Title, actor);
            }
        }

        string actor1 = "Zendaya";
        string actor2 = "Shia LaBeouf";
        Console.WriteLine($"Graph size: {graph.Size()}");
        graph.FindShortestPaths(actor1, actor2);
    }
}
