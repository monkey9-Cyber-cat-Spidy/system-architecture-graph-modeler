export class SystemGraphModeler {
  constructor() {
    this.adjacencyList = new Map();
  }

  addNode(node) {
    if (!this.adjacencyList.has(node)) {
      this.adjacencyList.set(node, new Set());
    }
  }

  addDependency(fromNode, toNode) {
    this.addNode(fromNode);
    this.addNode(toNode);
    this.adjacencyList.get(fromNode).add(toNode);
  }

  // Kahn's algorithm for topological sorting and cycle detection
  getTopologicalOrder() {
    const inDegree = new Map();
    for (const node of this.adjacencyList.keys()) {
      inDegree.set(node, 0);
    }

    for (const edges of this.adjacencyList.values()) {
      for (const neighbor of edges) {
        inDegree.set(neighbor, (inDegree.get(neighbor) || 0) + 1);
      }
    }

    const queue = [];
    for (const [node, deg] of inDegree.entries()) {
      if (deg === 0) queue.push(node);
    }

    const order = [];
    while (queue.length > 0) {
      const current = queue.shift();
      order.push(current);

      for (const neighbor of this.adjacencyList.get(current) || []) {
        inDegree.set(neighbor, inDegree.get(neighbor) - 1);
        if (inDegree.get(neighbor) === 0) {
          queue.push(neighbor);
        }
      }
    }

    if (order.length !== this.adjacencyList.size) {
      throw new Error('Cyclic dependency detected: Graph is not a DAG');
    }

    return order;
  }
}
