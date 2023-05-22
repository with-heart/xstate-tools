import {
  Node,
  isId,
  isMachine,
  isMachineConfig,
  isMachineFile,
} from '@xstate/tree';

// we can use predicates to identify specific types of nodes. this also narrows
// their type, making it easier to work with them.

// we have a generic `Node` but we don't know what its exact type is yet.
declare const node: Node;

if (isMachineFile(node)) {
  // node is narrowed to MachineFile
  node.machines;
  //   ^?
}
if (isMachine(node)) {
  // node is narrowed to Machine
  node.config;
  //   ^?
}
if (isMachineConfig(node)) {
  // node is narrowed to MachineConfig
  node.id;
  //   ^?
}
if (isId(node)) {
  // node is narrowed to Id
  node.value;
  //   ^?
}
