/**
 * Defines a unique kind identifier for each type of node in the tree.
 */
export enum NodeKind {}

/**
 * The base node type. Properties defined on `Node` are shared by all node
 * types.
 */
export interface Node {
  /** The unique kind identifier for this type of node. */
  readonly kind: NodeKind;
}
