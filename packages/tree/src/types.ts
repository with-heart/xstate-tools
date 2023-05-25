export type Mutable<T> = {
  -readonly [Key in keyof T]: T[Key];
};

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
  /** The parent node of the node. */
  readonly parent: Node;
}

/**
 * A source text file which may contain machines.
 */
export interface MachineFile extends Node {
  readonly kind: NodeKind.MachineFile;
  readonly parent: never;

  /** The machines contained in this file. */
  readonly machines: Machine[];
}

/**
 * A machine definition (`createMachine` call).
 */
export interface Machine extends Node {
  readonly kind: NodeKind.Machine;
  readonly parent: MachineFile;

  /** The machine's config node. */
  readonly config: MachineConfig;
}

/**
 * A machine's config object.
 */
export interface MachineConfig extends Node {
  readonly kind: NodeKind.MachineConfig;
  readonly parent: Machine;

  /** The machine's id node. */
  readonly id?: Id | undefined;
}

/**
 * The id of a machine.
 */
export interface Id extends Node {
  readonly kind: NodeKind.Id;
  readonly parent: MachineConfig;

  /** The text value of the id. */
  readonly value: string;
}
