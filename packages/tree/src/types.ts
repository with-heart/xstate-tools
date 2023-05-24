/**
 * Unique identifier for each node type.
 */
export enum NodeKind {
  Id = 'Id',
  Machine = 'Machine',
  MachineConfig = 'MachineConfig',
  MachineFile = 'MachineFile',
}

/**
 * A union of all `Node` types that have child nodes.
 */
export type HasChildren = MachineFile | Machine | MachineConfig;

/**
 * The base type for all node types in the tree.
 */
export interface Node {
  /** Unique identifier for this type of node. */
  readonly kind: NodeKind;
}

/**
 * A source text file which may contain machines.
 */
export interface MachineFile extends Node {
  readonly kind: NodeKind.MachineFile;

  /** The machines contained in this file. */
  readonly machines: Machine[];
}

/**
 * A machine definition (`createMachine` call).
 */
export interface Machine extends Node {
  readonly kind: NodeKind.Machine;

  /** The machine's config node. */
  readonly config: MachineConfig;
}

/**
 * A machine's config object.
 */
export interface MachineConfig extends Node {
  readonly kind: NodeKind.MachineConfig;

  /** The machine's id node. */
  readonly id?: Id | undefined;
}

/**
 * The id of a machine.
 */
export interface Id extends Node {
  readonly kind: NodeKind.Id;

  /** The text value of the id. */
  readonly value: string;
}
