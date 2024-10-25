class Node {
    constructor(value) {
        this.value = value;
        this.children = [];
    }

    addChild(child) {
        this.children.push(child);
    }
}

function bfs(root) {
    if (!root) return;

    const queue = [root];
    let depth = 0;

    while (queue.length > 0) {
        const levelSize = queue.length; // Number of nodes at the current depth
        console.log(`Depth ${depth}:`);

        for (let i = 0; i < levelSize; i++) {
            const currentNode = queue.shift();
            console.log(currentNode.value); // Process the current node

            // Enqueue all children of the current node
            for (const child of currentNode.children) {
                queue.push(child);
            }
        }

        depth++; // Increment depth after processing all nodes at the current level
    }
}

// Example usage:
const root = new Node(1);
const child1 = new Node(2);
const child2 = new Node(3);
const child3 = new Node(4);
const child4 = new Node(5);

root.addChild(child1);
root.addChild(child2);
child1.addChild(child3);
child2.addChild(child4);

bfs(root);
