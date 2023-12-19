# `@xstate/tree`

> A library for expressing [`xstate`](https://github.com/statelyai/xstate) code as a tree data structure.

## Quick start

```sh
npm install @xstate/tree
```

## Concepts

## Recipes

### Defining a new node

1. Define a unique `NodeKind` identifier:

```ts
export enum NodeKind {
  MachineOptions = 'MachineOptions',
}
```

2. Define a type for the node, making sure to extend from `Node` and override the `kind` and `parent` properties:

```ts
export interface MachineOptions extends Node {
  kind: NodeKind.MachineOptions;
  parent: Machine;

  // child node property
  actions?: MachineOptionsActions;
  // data property
  guards?: {};
}
```

3. Define a predicate for the node:

```ts
export function isMachineOptions(node: Node): node is MachineOptions {
  return node.kind === NodeKind.MachineOptions;
}
```

4. Define factory functions for the node:

## How it works

The base type of `@xstate/tree` is `Node`. Since all other node types extend from `Node`, it defines properties common to all nodes:

```ts
export interface Node {
  /** Unique identifier for this node type. */
  readonly kind: NodeKind;
  /** The parent node of this node. */
  readonly parent: Node;
  /** The location of the node's text in the file. */
  readonly pos: {
    readonly start: number;
    readonly end: number;
  };
}
```

To see why these common properties are important, let's define a few node types:

- `MachineFile`: a source code file which may contain machines (and our root node)
- `Machine`: a machine definition (`createMachine` call)
- `MachineConfig`: a machine's config object

For each type, we'll override the `kind` and `parent` properties with more specific values and also define properties specific to that type of node:

```ts
// For each type:
// 1. override the `kind` and `parent` properties with values specific to the node type
// 2. define properties containing data about the node or references to other node types (called the node's child nodes)

/** A source code file which may contain machines. */
export interface MachineFile extends Node {
  kind: NodeKind.MachineFile;
  // `MachineFile` is the root node so it doesn't have a parent
  parent: never;

  /** The machines in the file. */
  machines: Machine[];
}

/** A machine definition (`createMachine` call). */
export interface Machine extends Node {
  kind: NodeKind.Machine;
  // machines are children of `MachineFile`
  parent: MachineFile;

  /** The machine's config object. */
  config: MachineConfig;
}

/** A machine config object. */
export interface MachineConfig extends Node {
  kind: NodeKind.MachineConfig;
  parent: Machine;

  /** The machine's id. */
  id?: string;
  /** The machine's initial state. */
  initial?: string;
}
```

Now that we've defined a few node types, we can see how the types give us a lot of flexibility:

```ts
// we can use `Node` to refer to *any* node type
function printNodeInfo(node: Node) {
  // accessing a property common to all node types
  console.log(`Node of kind ${node.kind}`);

  // using `kind` to determine if `node` is a `MachineFile`
  if (node.kind === NodeKind.MachineFile) {
    // narrowing the type of `node` to the specific node type (which is safe
    // because we identified it by `kind`)
    const machineFile = node as MachineFile;

    // accessing the child `Machine` array
    console.log(
      `This machine file has ${machineFile.machines.length} machines.`,
    );
  }

  if (node.kind === NodeKind.Machine) {
    const machine = node as Machine;

    // accessing the child `MachineConfig` node
    if (machine.config.id) {
      console.log(`This machine has an id of ${machine.config.id}`);
    }

    // accessing the parent `MachineFile` node
    console.log(
      `This machine is one of ${node.parent.machines.length} machines in this file`,
    );
  }

  if (node.kind === NodeKind.MachineConfig) {
    const config = node as MachineConfig

    if (config.id) {
      console.log(`This config has an id of ${config.id}`)

      // accessing grandparent `MachineFile` node through parent `Machine`
      const machinesWithId = node.parent.parent.machines.filter(machine => !!machine.config.id)
    } else {
      console.log('This config has no id')
    }
    console.log(`This config has ${config.id ? `an id of ${config.id}` 'no id'}`)
  }
}
```
