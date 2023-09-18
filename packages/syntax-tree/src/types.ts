/**
 * Defines a unique kind identifier for each type of node in the tree.
 */
export enum NodeKind {
  MachineFile = 'MachineFile',
}

/**
 * The base node type. Properties defined on `Node` are shared by all node
 * types.
 */
export interface Node {
  /** The unique kind identifier for this type of node. */
  readonly kind: NodeKind;
}

/**
 * Root node which contains zero or more machine definitions.
 */
export interface MachineFile extends Node {
  readonly kind: NodeKind.MachineFile;

  /** The machine definitions contained in this file. */
  readonly machines: [];
}
