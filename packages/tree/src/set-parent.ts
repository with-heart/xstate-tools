import { forEachChildRecursive } from './for-each-child';
import { Mutable, Node } from './types';

/**
 * Bypasses immutability and directly sets the `parent` property of a `Node`.
 */
export function setParent<N extends Node>(
  child: N,
  parent: N['parent'] | undefined,
): N;
export function setParent<N extends Node>(
  child: N | undefined,
  parent: N['parent'] | undefined,
): N | undefined {
  if (child && parent) {
    (child as Mutable<N>).parent = parent;
  }
  return child;
}

/**
 * Bypasses immutability and directly sets the `parent` property of each `Node`
 * in a tree recursively.
 */
export function setParentRecursive<N extends Node>(rootNode: N): N;
export function setParentRecursive<N extends Node>(
  rootNode: N | undefined,
): N | undefined {
  if (!rootNode) return undefined;

  forEachChildRecursive(rootNode, bindParentToChild);
  return rootNode;

  function bindParentToChild(child: Node, parent: Node) {
    setParent(child, parent);
  }
}
