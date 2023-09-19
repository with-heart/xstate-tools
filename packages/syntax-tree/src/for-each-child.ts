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
