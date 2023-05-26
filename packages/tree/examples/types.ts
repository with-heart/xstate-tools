import {
  Id,
  Machine,
  MachineConfig,
  MachineFile,
  NodeKind,
} from '@xstate/tree';

// types define the shape of nodes in the tree

// an id node
const id: Id = {
  kind: NodeKind.Id,
  value: 'an-id',
  // parent properties added separately by tooling
  parent: undefined as never,
  // position properties added separately by tooling
  pos: { start: 0, end: 0 },
};

// a machine config node
const machineConfig: MachineConfig = {
  kind: NodeKind.MachineConfig,
  // we can use our id node here
  id,
  parent: undefined as never,
  pos: { start: 0, end: 0 },
};

// a machine node
const machine: Machine = {
  kind: NodeKind.Machine,
  // we can use our config node here
  config: machineConfig,
  parent: undefined as never,
  pos: { start: 0, end: 0 },
};

// a machine file node with some machines
// @ts-expect-error unused var
const machineFile: MachineFile = {
  // each type of node has a unique kind identifier
  kind: NodeKind.MachineFile,
  machines: [
    // we can use our machine node here
    machine,
    // machine with an id of 'some-id'
    {
      kind: NodeKind.Machine,
      config: {
        kind: NodeKind.MachineConfig,
        id: {
          kind: NodeKind.Id,
          value: 'some-id',
          parent: undefined as never,
          pos: { start: 0, end: 0 },
        },
        pos: { start: 0, end: 0 },
        parent: undefined as never,
      },
      parent: undefined as never,
      pos: { start: 0, end: 0 },
    },
    // machine with an empty config (no id)
    {
      kind: NodeKind.Machine,
      config: {
        kind: NodeKind.MachineConfig,
        parent: undefined as never,
        pos: { start: 0, end: 0 },
      },
      parent: undefined as never,
      pos: { start: 0, end: 0 },
    },
  ],
  // a `MachineFile` node never has a parent (it's the root node)
  parent: undefined as never,
};
