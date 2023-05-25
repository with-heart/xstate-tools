import { factory } from '@xstate/tree';

// factory fns allow us to create and update nodes

// let's recreate examples/types.ts, but with factory fns

// an id node
const id = factory.createId('an-id');

// a machine config node
const machineConfig = factory.createMachineConfig(
  // we can use our id node here
  id,
);

// a machine node
const machine = factory.createMachine(
  // we can use our config node here
  machineConfig,
);

// a machine file node with some machines
const machineFile = factory.createMachineFile([
  // we can use our machine node here
  machine,
  // machine with an id of 'some-id'
  factory.createMachine(
    factory.createMachineConfig(factory.createId('some-id')),
  ),
  // machine with no id
  factory.createMachine(factory.createMachineConfig()),
]);

// factory also allows us to update existing nodes. if the data is different
// than the node's data, then a *new node* is returned (otherwise it just
// returns the same node)

const updatedId = factory.updateId(id, 'new-id');

const updatedMachineConfig = factory.updateMachineConfig(
  machineConfig,
  updatedId,
);

const updatedMachine = factory.updateMachine(machine, updatedMachineConfig);

// @ts-expect-error unused var
const updatedMachineFile = factory.updateMachineFile(machineFile, [
  updatedMachine,
]);
