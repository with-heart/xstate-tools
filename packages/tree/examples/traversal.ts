import {
  Node,
  factory,
  forEachChild,
  isId,
  isMachine,
  isMachineConfig,
} from '@xstate/tree';

// the forEachChild function allows us to iterate over the children of a node

// log the value of the machine config's id node
forEachChild(
  factory.createMachineConfig(factory.createId('some-id')),
  (node) => {
    if (isId(node)) {
      console.log(node.value);
    }
  },
); // logs "some-id"

// we can also use the forEachChild function *recursively* in order to call the
// callback on all descendants of the node. if we call forEachChild again inside
// the callback, it iterates over all of the node's children, its childrens'
// children, and so on.

// in this example, we'll visit (iterate over) each descendant of this machine
// file and log some information about it.
const machineFile = factory.createMachineFile([
  factory.createMachine(factory.createMachineConfig(factory.createId('id-1'))),
  factory.createMachine(factory.createMachineConfig()),
  factory.createMachine(factory.createMachineConfig(factory.createId('id-2'))),
]);

forEachChild(machineFile, visitNode); // logs the following:
// Machine!
// MachineConfig! It has an id
// Id of id-1!
// Machine!
// MachineConfig! It does not have an id
// Machine!
// MachineConfig! It has an id
// Id of id-2!

function visitNode(node: Node): void {
  if (isMachine(node)) {
    console.log('Machine!');
  }

  if (isMachineConfig(node)) {
    console.log(`MachineConfig! It ${node.id ? 'has' : 'does not have'} an id`);
  }

  if (isId(node)) {
    console.log(`Id of ${node.value}!`);
  }

  // call `forEachChild` again to iterate over the current node's children
  return forEachChild(node, visitNode);
}
