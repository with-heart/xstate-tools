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
};

// a machine config node
const machineConfig: MachineConfig = {
  kind: NodeKind.MachineConfig,
  // we can use our id node here
  id,
};

// a machine node
const machine: Machine = {
  kind: NodeKind.Machine,
  // we can use our config node here
  config: machineConfig,
};

// a machine file node with some machines
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
        },
      },
    },
    // machine with an empty config (no id)
    {
      kind: NodeKind.Machine,
      config: {
        kind: NodeKind.MachineConfig,
      },
    },
  ],
};
