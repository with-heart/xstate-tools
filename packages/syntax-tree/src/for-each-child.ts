import { HasChildren, Node, NodeKind } from './types';

/**
 * Type for a node type-specific function which iterates over the child nodes of
 * that node type.
 */
type ForEachChildFn<NodeType extends Node> = <T>(
  /** The node whose child nodes to iterate. */
  node: NodeType,
  /**
   * Callback for each individual child node property of the given node.
   *
   * If the `nodesCallback` parameter is not provided, this callback will also
   * be called once for each node in a child array node.
   */
  nodeCallback: (node: Node) => T | undefined,
  /** Optional callback called with each child array node property. */
  nodesCallback?: (nodes: Node[]) => T | undefined,
) => T | undefined;

/**
 * Type for a table of node type-specific functions which define the logic of
 * iterating over the child nodes of that node type.
 */
type ForEachChildTable = {
  [NodeType in HasChildren as NodeType['kind']]: ForEachChildFn<NodeType>;
};

/**
 * A table containing a node type-specific `forEachChild` function for each node
 * which has child nodes. These functions define how to iterate over the child
 * nodes for those types.
 *
 * Each function should call `visitNode` for each of its child node properties
 * (or `visitNodes` if the child is an array).
 *
 * This table is used by `forEachChild` to select the appropriate function based
 * on the type of `Node` it receives.
 *
 * If a node type is added to `HasChildren`, `forEachChildTable` will throw a
 * type error until a `forEachChild` function is implemented for that node type.
 */
const forEachChildTable: ForEachChildTable = {
  [NodeKind.Machine]: function forEachChildInMachine(node, nodeCallback) {
    return visitNode(nodeCallback, node.config);
  },
  [NodeKind.MachineConfig]: function forEachChildInMachineConfig(
    node,
    nodeCallback,
  ) {
    return visitNode(nodeCallback, node.id);
  },
  [NodeKind.MachineFile]: function forEachChildInMachineFile(
    node,
    nodeCallback,
    nodesCallback,
  ) {
    return visitNodes(nodeCallback, nodesCallback, node.machines);
  },
};

/**
 * Invokes a callback for each child of the given node.
 *
 * The callback invoked for each child depends on the child's type:
 *
 * - if the child is an individual node, `nodeCallback` is called with the node
 * - if the child is an array and `nodesCallback` is provided, `nodesCallback`
 * is called with the child array
 * - if the child is an array and `nodesCallback` is not provided,
 * `nodeCallback` is called once for each node in the array
 *
 * @param node the node with child nodes to iterate over
 * @param nodeCallback a callback function which handles individual child nodes
 * @param nodesCallback a callback function which handles array child nodes. if
 * undefined, nodeCallback is called once for each node in the array
 */
export function forEachChild<T>(
  node: Node | undefined,
  nodeCallback: (node: Node) => T | undefined,
  nodesCallback?: ((nodes: Node[]) => T | undefined) | undefined,
): T | undefined {
  if (node === undefined) {
    return undefined;
  }

  const fn = (forEachChildTable as Record<NodeKind, ForEachChildFn<Node>>)[
    node.kind
  ];
  return fn === undefined ? undefined : fn(node, nodeCallback, nodesCallback);
}

/**
 * Invokes a callback for each descendant node of the given node along with the
 * descendant's parent node.
 *
 * The callback invoked for each child depends on the child's type:
 *
 * - if the child is an individual node, `nodeCallback` is called with the node
 * - if the child is an array and `nodesCallback` is provided, `nodesCallback`
 * is called with the child array
 * - if the child is an array and `nodesCallback` is not provided,
 * `nodeCallback` is called once for each node in the array
 *
 * If a callback returns a truthy value, recursion stops and that value is
 * returned. Otherwise, `undefined` is returned.
 *
 * @param rootNode the root node with descendant nodes to recurse over
 * @param nodeCallback a callback function which handles individual child nodes
 * @param nodesCallback a callback function which handles array child nodes. if
 * undefined, nodeCallback is called once for each node in the array
 *
 * @example
 * const machineFile = factory.createMachineFile([
 *   // machine with config with id
 *   factory.createMachine(
 *     factory.createMachineConfig(factory.createId('some-id')),
 *   ),
 *   // machine with config without id
 *   factory.createMachine(factory.createMachineConfig()),
 * ]);
 *
 * forEachChildRecursive(
 *   machineFile,
 *   (node: Node, parent: Node) =>
 *     console.log(`node ${node.kind} with parent ${parent.kind}`),
 *   (nodes: Node[], parent: Node) =>
 *     console.log(`nodes of type ${nodes[0]} with parent ${parent.kind}`),
 * );
 * // => nodes of type Machine with parent MachineFile
 * // => node Machine with parent MachineFile
 * // => node Id with parent Machine
 * // => node Machine with parent MachineFile
 * // => node MachineConfig with parent Machine
 */
export function forEachChildRecursive<T>(
  rootNode: Node,
  nodeCallback: (node: Node, parent: Node) => T | undefined,
  nodesCallback?: (nodes: Node[], parent: Node) => T | undefined,
): T | undefined {
  // queue initialized with the root node's children
  const queue: (Node | Node[])[] = gatherPossibleChildren(rootNode);
  // empty parents queue
  const parents: Node[] = [];

  // add rootNode as a parent for each child in queue
  while (parents.length < queue.length) {
    parents.push(rootNode);
  }

  // iterate as long as there are nodes in the queue
  while (queue.length !== 0) {
    const current = queue.pop()!;
    const parent = parents.pop()!;

    if (Array.isArray(current)) {
      // if we have a nodesCallback, call it with the nodes and their parent. if
      // it returns a result, stop recursing and return that value
      if (nodesCallback) {
        const result = nodesCallback(current, parent);

        if (result) {
          return result;
        }
      }

      // add each child in the current array to the queue and a parent for each
      for (const node of [...current].reverse()) {
        queue.push(node);
        parents.push(parent);
      }
    } else {
      // if we have a nodeCallback, call it with the node and its parent. if it
      // returns a result, stop recursing and return that value
      const result = nodeCallback(current, parent);

      if (result) {
        return result;
      }

      // add each child of the current node to the queue and a parent for each
      for (const child of gatherPossibleChildren(current)) {
        queue.push(child);
        parents.push(current);
      }
    }
  }

  return undefined;
}

function gatherPossibleChildren(node: Node) {
  const children: (Node | Node[])[] = [];
  forEachChild(node, addWorkItem, addWorkItem);
  return children;

  function addWorkItem(n: Node | Node[]) {
    children.unshift(n);
  }
}

/**
 * Handles applying a node callback to a node.
 *
 * Calls `nodeCallback` with `node` if `node` is defined. If `nodeCallback`
 * returns a value, `visitNode` returns that value.
 */
function visitNode<T>(
  nodeCallback: (node: Node) => T | undefined,
  node: Node | undefined,
): T | undefined {
  return node && nodeCallback(node);
}

/**
 * Handles applying a nodes callback to a node array.
 */
function visitNodes<T>(
  nodeCallback: (node: Node) => T | undefined,
  nodesCallback: ((nodes: Node[]) => T | undefined) | undefined,
  nodes: Node[] | undefined,
): T | undefined {
  // if nodes is undefined, return undefined
  if (!nodes) {
    return undefined;
  }

  // if nodesCallback is defined, return result of nodesCallback
  if (nodesCallback) {
    return nodesCallback(nodes);
  }

  // otherwise, call nodeCallback for each node. if any nodeCallback call
  // returns a value, stop iterating and return that value
  for (const node of nodes) {
    const result = nodeCallback(node);

    if (result) {
      return result;
    }
  }

  return undefined;
}
