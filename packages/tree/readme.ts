import {
  MachineFile,
  Node,
  factory,
  forEachChild,
  getLineAndCharacterOfPosition,
  isId,
  isMachineConfig,
} from '@xstate/tree';

// - require machine config to have an `id`
// - require `id` not to be an empty string (or whitespace)
function lint(machineFile: MachineFile) {
  // traverse each child machine of the machine file
  forEachChild(machineFile, visitNode);

  function visitNode(node: Node) {
    if (isMachineConfig(node)) {
      // get the child id node
      const id = node.id;

      // report error if we have no id
      if (!id) {
        report(node, 'Machine has no id');
      }
    }

    if (isId(node)) {
      // the id's value
      const value = node.value;

      // report error if it's an empty string (or whitespace)
      if (value.trim() === '') {
        report(node, 'Id cannot be an empty string (or whitespace)');
      }
    }

    // recursively traverse child nodes to make sure we lint all nodes in the
    // tree
    forEachChild(node, visitNode);
  }

  function report(node: Node, message: string) {
    const { line, character } = getLineAndCharacterOfPosition(
      machineFile,
      node.pos.start,
    );
    console.log(`Error at ${line}:${character}: ${message}`);
  }
}
