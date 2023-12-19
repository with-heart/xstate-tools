import { MachineFile, forEachChild, isId } from '@xstate/tree';

/**
 * For a given machine file, print the total number of machines, the number of
 * machines with an id, and the list of ids (if any).
 */
function printMachinesInfo(machineFile: MachineFile) {
  const ids: string[] = [];

  // call visitNode for each child machine in the machine file
  forEachChild(machineFile, function visitNode(node) {
    // if the node is of kind Id, add it to the list of ids
    if (isId(node)) {
      ids.push(node.value);
    }

    // call visitNode on each child of the node. this means visitNode is
    // recursively called for all nodes in the tree
    forEachChild(node, visitNode);
  });

  console.log(
    `The file ${machineFile.fileName} contains ${machineFile.machines.length} machines`,
  );
  console.log(`${ids.length} machines have an id`);

  if (ids.length > 0) {
    console.log(`List of ids: ${ids.join(', ')}`);
  }
}
