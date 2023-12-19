import { Node, factory, forEachChild } from '@xstate/tree';

const machineFile = factory.createMachineFile([
  // machine with an id
  factory.createMachine(
    factory.createMachineConfig(factory.createId('some-id')),
  ),
  // machine with no id
  factory.createMachine(factory.createMachineConfig()),
]);

// call `callback` with each child node
forEachChild(machineFile, function callback(node: Node) {
  console.log(`Node of kind ${node.kind}`);

  // and then call `callback` with each child node of the child node to make it
  // recursive
  forEachChild(node, callback);
});
// logs:
// "Node of kind Machine" (machineFile.machines[0])
// "Node of kind MachineConfig"
// "Node of kind Id"
// "Node of kind Machine" (machineFile.machines[1])
// "Node of kind MachineConfig"
