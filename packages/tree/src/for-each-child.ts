import { HasChildren, Node, NodeKind } from './types';

type ForEachChildFn<N> = <T>(
  node: N,
  nodeCallback: (node: Node) => T | undefined,
  nodesCallback: ((nodes: Node[]) => T | undefined) | undefined,
) => T | undefined;

/**
 * Defines a table of `forEachChild` functions for each `Node` type in
 * `HasChildren`.
 */
type ForEachChildTable = {
  [N in HasChildren as N['kind']]: ForEachChildFn<N>;
};

/**
 * Defines a table of `forEachChild` functions for each `Node` type in
 * `HasChildren`.
 *
 * Each function calls `visitNode` for each of its child nodes, or `visitNodes`
 * if the child is an array.
 *
 * This table is used by `forEachChild` to select the correct function to call
 * based on its `node` argument's `kind`.
 */
const forEachChildTable: ForEachChildTable = {
  [NodeKind.Machine]: function forEachChildInMachine(node, nodeCallback) {
    return visitNode(nodeCallback, node.config);
  },
  [NodeKind.MachineFile]: function forEachChildInMachineFile(
    node,
    nodeCallback,
    nodesCallback,
  ) {
    return visitNodes(nodeCallback, nodesCallback, node.machines);
  },
  [NodeKind.MachineConfig]: function forEachChildInMachineConfig(
    node,
    nodeCallback,
  ) {
    return visitNode(nodeCallback, node.id);
  },
};

/**
 * Invokes a callback for each child of the given node.
 *
 * The callback invoked for each child depends on the child's type:
 *
 * - if the child is an individual node, `nodeCallback` is called with that node
 * - if the child is an array and `nodesCallback` is provided, `nodesCallback`
 * is called with that array
 * - if the child is an array and `nodesCallback` is NOT provided,
 * `nodeCallback` is called once for each element in the array
 *
 * If a callback returns a truthy value, iteration stops and that value is
 * returned. Otherwise, `undefined` is returned.
 *
 * @param node a given node to visit its children
 * @param nodeCallback a callback to be invoked for all child nodes
 * @param nodesCallback a callback to be invoked for child arrays
 *
 * @example
 *
 * # Examples
 *
 * ## Node with individual child + nodeCallback
 *
 * ```ts
 * const machineConfig = factory.createMachineConfig(factory.createId('some-id'));
 *
 * forEachChild(machineConfig, visitNode); // logs "some-id"
 *
 * function visitNode(node: Node) {
 *   if (isId(node)) {
 *     console.log(node.value);
 *   }
 * }
 * ```
 *
 * ## Node with child array + nodeCallback
 *
 * ```ts
 * const machineFile = factory.createMachineFile([
 *   factory.createMachine(factory.createMachineConfig(factory.createId('id-1'))),
 *   factory.createMachine(factory.createMachineConfig()),
 *   factory.createMachine(factory.createMachineConfig(factory.createId('id-2'))),
 * ]);
 *
 * forEachChild(machineFile, visitNode); // logs "id-1", then "id-2"
 *
 * function visitNode(node: Node) {
 *   if (isMachine(node) && node.config.id) {
 *     console.log(node.config.id.value);
 *   }
 * }
 * ```
 *
 * ## Node with child array + nodesCallback
 *
 * ```ts
 * const machineFile = factory.createMachineFile([
 *   factory.createMachine(factory.createMachineConfig(factory.createId('id-1'))),
 *   factory.createMachine(factory.createMachineConfig()),
 *   factory.createMachine(factory.createMachineConfig(factory.createId('id-2'))),
 * ]);
 *
 * forEachChild(machineFile, visitNode, visitNodes); // logs "id-1", then "id-2"
 *
 * function visitNodes(nodes: Node[]) {
 *   for (const node of nodes) {
 *     if (isMachine(node) && node.config.id) {
 *       console.log(node.config.id.value);
 *     }
 *   }
 * }
 *
 * function visitNode() {
 *   // not called because visitNodes is used instead
 * }
 * ```
 *
 * ## Return a value and stop iteration
 *
 * ```ts
 * const machineFile = factory.createMachineFile([
 *   // callback returns undefined
 *   factory.createMachine(factory.createMachineConfig()),
 *   // callback returns "id-1"
 *   factory.createMachine(factory.createMachineConfig(factory.createId('id-1'))),
 *   // callback is not called
 *   factory.createMachine(factory.createMachineConfig(factory.createId('id-2'))),
 * ]);
 *
 * const result = forEachChild(machineFile, visitNode);
 * console.log(result); // logs "id-1"
 *
 * function visitNode(node: Node) {
 *   if (isMachine(node) && node.config.id) {
 *     return node.config.id.value;
 *   }
 * }
 * ```
 *
 * ## Using recursion to iterate over all descendants
 *
 * By calling `forEachChild` again within the callback, we iterate over not only
 * the node's children, but its childrens' children, its childrens' childrens'
 * children, and so on.
 *
 * ```ts
 * const machineFile = factory.createMachineFile([
 *   factory.createMachine(factory.createMachineConfig(factory.createId('id-1'))),
 *   factory.createMachine(factory.createMachineConfig()),
 *   factory.createMachine(factory.createMachineConfig(factory.createId('id-2'))),
 * ]);
 *
 * forEachChild(machineFile, visitNode); // logs the following:
 * // A machine!
 * // A machine config! It has an id
 * // An id of id-1!
 * // A machine!
 * // A machine config! It does not have an id
 * // A machine!
 * // A machine config! It has an id
 * // An id of id-2!
 *
 * function visitNode(node: Node): void {
 *   if (isMachine(node)) {
 *     console.log(`A machine!`);
 *   }
 *
 *   if (isMachineConfig(node)) {
 *     console.log(
 *       `A machine config! It ${node.id ? 'has' : 'does not have'} an id`,
 *     );
 *   }
 *
 *   if (isId(node)) {
 *     console.log(`An id of ${node.value}!`);
 *   }
 *
 *   // call `forEachChild` again to iterate over each node's children
 *   return forEachChild(node, visitNode);
 * }
 * ```
 */
export function forEachChild<T>(
  node: Node,
  nodeCallback: (node: Node) => T | undefined,
  nodesCallback?: (nodes: Node[]) => T | undefined,
): T | undefined {
  if (node === undefined) {
    return undefined;
  }

  const fn = (forEachChildTable as Record<NodeKind, ForEachChildFn<any>>)[
    node.kind
  ];
  return fn === undefined ? undefined : fn(node, nodeCallback, nodesCallback);
}

export function visitNode<T>(
  nodeCallback: (node: Node) => T | undefined,
  node: Node | undefined,
): T | undefined {
  // call `nodeCallback` if `node` is defined
  return node && nodeCallback(node);
}

export function visitNodes<T>(
  nodeCallback: (node: Node) => T | undefined,
  nodesCallback: ((nodes: Node[]) => T | undefined) | undefined,
  nodes: Node[] | undefined,
): T | undefined {
  // no nodes? no callback
  if (!nodes) {
    return undefined;
  }

  // if we have a callback for the array, use it
  if (nodesCallback) {
    return nodesCallback(nodes);
  }

  // otherwise iterate through each node in the array
  for (const node of nodes) {
    const result = nodeCallback(node);
    // if the callback returns a truthy value, stop iteration and return it
    if (result) {
      return result;
    }
  }

  return undefined;
}
