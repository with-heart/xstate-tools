import { factory } from '@xstate/tree';

// create some ids
const id1 = factory.createId('id-1');
const id2 = factory.createId('id-2');

// create some machine configs from those ids
const machineConfig1 = factory.createMachineConfig(id1);
const machineConfig2 = factory.createMachineConfig(id2);

// create some machines from those machine configs
const machine1 = factory.createMachine(machineConfig1);
const machine2 = factory.createMachine(machineConfig2);

// create a machine file from those machines (plus two created inline)
const machineFile = factory.createMachineFile([
  machine1,
  machine2,
  factory.createMachine(factory.createMachineConfig(factory.createId('id-3'))),
  // this machine has no id
  factory.createMachine(factory.createMachineConfig()),
]);

// log out the machine ids in the tree
const ids: string[] = [];
for (const machine of machineFile.machines) {
  const id = machine.config.id?.value;
  if (id) {
    ids.push(id);
  }
}
console.log(ids); // ['id-1', 'id-2', 'id-3']
