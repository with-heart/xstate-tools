import {
  createMachineFile,
  factory,
  forEachChild,
  isMachineConfig,
} from '@xstate/tree';

// createMachineFile acts as the entry point to a tree, wrapping
// `factory.createMachineFile` with a call to `setParentRecursive` so that all
// nodes in the tree have a parent node.

const machineFile = createMachineFile([
  factory.createMachine(factory.createMachineConfig()),
  factory.createMachine(factory.createMachineConfig()),
  factory.createMachine(factory.createMachineConfig()),
]);

// since it automatically sets the parent of each node, we can use the `parent`
// property to navigate up the tree

forEachChild(machineFile, function visitNode(node) {
  if (isMachineConfig(node)) {
    // node.parent is the Machine
    // node.parent.parent (grandparent) is the MachineFile
    const machineFile = node.parent.parent;
    console.log(
      `I'm a machine config in a machine file with ${machineFile.machines.length} machines!`,
    );
  }
});
