export type Mutable<T> = {
  -readonly [Key in keyof T]: T[Key];
};

/**
 * Unique identifier for each node type.
 */
export enum NodeKind {
  ActionFunction = 'ActionFunction',
  ActionObject = 'ActionObject',
  ActionObjectParam = 'ActionObjectParam',
  ActionString = 'ActionString',
  Entry = 'Entry',
  Exit = 'Exit',
  Id = 'Id',
  Machine = 'Machine',
  MachineConfig = 'MachineConfig',
  MachineImplementations = 'MachineImplementations',
  MachineFile = 'MachineFile',
  On = 'On',
  State = 'State',
  StateConfig = 'StateConfig',
  States = 'States',
  Transition = 'Transition',
  TransitionActions = 'TransitionActions',
  TransitionConfig = 'TransitionConfig',
  TransitionTarget = 'TransitionTarget',
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
  /** The start and end positions of the node's text in the file. */
  readonly pos: {
    readonly start: number;
    readonly end: number;
  };
}

/**
 * A source text file which may contain machines.
 */
export interface MachineFile extends Node {
  readonly kind: NodeKind.MachineFile;
  readonly parent: never;

  /** The name of the file. */
  readonly fileName: string;
  /** The source text of the file. */
  readonly sourceText: string;
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
 * The id of a machine or state.
 */
export interface Id extends Node {
  readonly kind: NodeKind.Id;
  readonly parent: MachineConfig;

  /** The text value of the id. */
  readonly value: string;
}

export interface States extends Node {
  readonly kind: NodeKind.States;
  readonly parent: MachineConfig | States;

  readonly states: State[];
}

export interface State extends Node {
  readonly kind: NodeKind.State;
  readonly parent: States;

  readonly key: string;
  readonly config: StateConfig;
}

export interface StateConfig extends Node {
  readonly kind: NodeKind.StateConfig;
  readonly parent: State;

  readonly entry?: Entry;
  readonly exit?: Exit;
  /** The transitions definition for this state. */
  readonly on?: On;
  /** The states for this state. */
  readonly states?: States;
}

export interface On extends Node {
  readonly kind: NodeKind.On;
  readonly parent: StateConfig;
}

export interface ActionsBase extends Node {
  readonly isActionsArray?: boolean;
}

export interface Entry extends Node {
  readonly kind: NodeKind.Entry;
  readonly parent: StateConfig | MachineConfig;

  readonly actions: ActionConfig[];
}

export interface Exit extends Node {
  readonly kind: NodeKind.Exit;
  readonly parent: StateConfig | MachineConfig;

  readonly actions: ActionConfig[];
}

export type ActionConfig = ActionFunction | ActionReference;

export type ActionReference = ActionObject | ActionString;

export interface ActionFunction extends Node {
  readonly kind: NodeKind.ActionFunction;
  readonly parent: Entry | Exit | TransitionActions;
}

export interface ActionObject extends Node {
  readonly kind: NodeKind.ActionObject;
  readonly parent: Entry | Exit | TransitionActions;

  readonly type: string;
  readonly params: ActionObjectParam[];
}

export interface ActionString extends Node {
  readonly kind: NodeKind.ActionString;
  readonly parent: Entry | Exit | TransitionActions;

  readonly type: string;
}
