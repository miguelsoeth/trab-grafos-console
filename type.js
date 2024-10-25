var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var fs = require('fs-extra');
var Graph = /** @class */ (function () {
    function Graph() {
        this.adjacencyList = new Map();
    }
    // AddVertex adds a vertex to the graph.
    Graph.prototype.addVertex = function (vertex) {
        if (!this.adjacencyList.has(vertex)) {
            this.adjacencyList.set(vertex, []);
        }
    };
    // AddEdge adds an edge between two vertices.
    Graph.prototype.addEdge = function (vertex1, vertex2) {
        var _a, _b;
        if (!this.adjacencyList.has(vertex1))
            this.addVertex(vertex1);
        if (!this.adjacencyList.has(vertex2))
            this.addVertex(vertex2);
        (_a = this.adjacencyList.get(vertex1)) === null || _a === void 0 ? void 0 : _a.push(vertex2);
        (_b = this.adjacencyList.get(vertex2)) === null || _b === void 0 ? void 0 : _b.push(vertex1);
    };
    // Size returns the number of vertices in the graph.
    Graph.prototype.size = function () {
        return this.adjacencyList.size;
    };
    // FindShortestPaths finds the shortest paths between two actors.
    Graph.prototype.findShortestPaths = function (actor1, actor2) {
        var queue = [[actor1]];
        var visited = new Set([actor1]);
        var paths = [];
        while (queue.length > 0) {
            var currentPath = queue.shift();
            var currentVertex = currentPath[currentPath.length - 1];
            // Limit path length to 8 edges (9 vertices)
            if (currentPath.length > 9)
                continue;
            if (currentVertex === actor2) {
                paths.push(__spreadArray([], currentPath, true));
                console.log(paths.length);
                continue;
            }
            var neighbors = this.adjacencyList.get(currentVertex) || [];
            for (var _i = 0, neighbors_1 = neighbors; _i < neighbors_1.length; _i++) {
                var neighbor = neighbors_1[_i];
                if (!currentPath.includes(neighbor)) {
                    var newPath = __spreadArray(__spreadArray([], currentPath, true), [neighbor], false);
                    queue.push(newPath);
                    if (!visited.has(neighbor) && newPath.length < 9) {
                        visited.add(neighbor);
                    }
                }
            }
        }
        if (paths.length > 0) {
            console.log("Shortest paths between ".concat(actor1, " and ").concat(actor2, ":"));
            console.log(paths.length);
            return paths;
        }
        else {
            console.log("No relationship between ".concat(actor1, " and ").concat(actor2));
            return paths;
        }
    };
    return Graph;
}());
// Save result to a file
function saveResultToFile(dataToSave) {
    return __awaiter(this, void 0, void 0, function () {
        var filePath, lines, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    filePath = './output_csharp.txt';
                    lines = dataToSave.map(function (list) { return list.join(', '); });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, fs.writeFile(filePath, lines.join('\n'), 'utf-8')];
                case 2:
                    _a.sent();
                    console.log("Data saved to ".concat(filePath));
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error("Error writing to file: ".concat(error_1));
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var jsonData, error_2, movies, graph, _i, movies_1, movie, _a, _b, actor, actor1, actor2, result;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, fs.readFile('./latest_movies.json', 'utf-8')];
                case 1:
                    jsonData = _c.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_2 = _c.sent();
                    console.error("Error reading JSON file: ".concat(error_2));
                    return [2 /*return*/];
                case 3:
                    try {
                        movies = JSON.parse(jsonData);
                    }
                    catch (error) {
                        console.error("Error parsing JSON: ".concat(error));
                        return [2 /*return*/];
                    }
                    graph = new Graph();
                    for (_i = 0, movies_1 = movies; _i < movies_1.length; _i++) {
                        movie = movies_1[_i];
                        graph.addVertex(movie.title);
                        for (_a = 0, _b = movie.cast; _a < _b.length; _a++) {
                            actor = _b[_a];
                            graph.addVertex(actor);
                            graph.addEdge(movie.title, actor);
                        }
                    }
                    actor1 = 'John Cena';
                    actor2 = 'Will Poulter';
                    console.log("Graph size: ".concat(graph.size()));
                    result = graph.findShortestPaths(actor1, actor2);
                    return [4 /*yield*/, saveResultToFile(result)];
                case 4:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    });
}
main().catch(console.error);
