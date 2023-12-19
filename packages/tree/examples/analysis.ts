import { MachineFile, factory, forEachChild, isId } from '@xstate/tree';

// we can use our types, predicates, and forEachChild to traverse and analyze a
// tree

// let's do a little analysis of a machine file by creating a function that
// displays some statistics about its contents:
// - number of machines
// - number of machines with an id
// - % of machines with an id
// - list all ids
function analyzeFile(machineFile: MachineFile) {
  if (machineFile.machines.length === 0) {
    console.log('This file has no machines in it!');
  }

  const ids: string[] = [];

  // find all the ids
  forEachChild(machineFile, function visitNode(node) {
    if (isId(node)) {
      ids.push(node.value);
    }
    forEachChild(node, visitNode);
  });

  console.log(`Number of machines: ${machineFile.machines.length}`);
  console.log(`Number of machines with an id: ${ids.length}`);
  console.log(
    `% of machines with an id: ${
      (ids.length / machineFile.machines.length) * 100
    }%`,
  );
  console.log(`List of ids: ${ids.join(', ')}`);
}

// next let's create a machine file with 4 machines
const machineFile = factory.createMachineFile([
  factory.createMachine(factory.createMachineConfig()),
  factory.createMachine(factory.createMachineConfig(factory.createId('id-1'))),
  factory.createMachine(factory.createMachineConfig()),
  factory.createMachine(factory.createMachineConfig(factory.createId('id-2'))),
]);

// and now let's analyze it!
analyzeFile(machineFile); // logs the following:
// Number of machines: 4
// Number of machines with an id: 2
// % of machines with an id: 50%
// List of ids: id-1, id-2
