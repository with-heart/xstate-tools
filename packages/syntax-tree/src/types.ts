/**
 * Defines a unique kind identifier for each type of node in the tree.
 */
export enum NodeKind {
  Id = 'Id',
  Machine = 'Machine',
  MachineConfig = 'MachineConfig',
  MachineFile = 'MachineFile',
}

/**
 * Node types which have child nodes.
 */
export type HasChildren = Machine | MachineConfig | MachineFile;

/**
 * The base node type. Properties defined on `Node` are shared by all node
 * types.
 */
export interface Node {
  /** The unique kind identifier for this type of node. */
  readonly kind: NodeKind;
}

/**
 * Node for the `id` property of a state/machine config.
 */
export interface Id extends Node {
  readonly kind: NodeKind.Id;

  /** The string value of the id. */
  readonly value: string;
}

/**
 * Node for a machine definition (`createMachine`).
 */
export interface Machine extends Node {
  readonly kind: NodeKind.Machine;

  /** The machine's config object node. */
  readonly config: MachineConfig;
}

/**
 * Node for a machine's config object.
 */
export interface MachineConfig extends Node {
  readonly kind: NodeKind.MachineConfig;

  /** The machine's id node. */
  readonly id?: Id | undefined;
}

/**
 * Root node which contains zero or more machine definitions.
 */
export interface MachineFile extends Node {
  readonly kind: NodeKind.MachineFile;

  /** The machine definitions contained in this file. */
  readonly machines: Machine[];
}
