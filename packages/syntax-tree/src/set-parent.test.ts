import { factory } from '@xstate/syntax-tree';
import { setParent, setParentRecursive } from './set-parent';

test('setParent', () => {
  const config = factory.createMachineConfig();
  const machine = factory.createMachine(config);

  // by default, no parent is set factory
  expect(config.parent).toBeUndefined();

  setParent(config, machine);

  // parent is now set
  expect(config.parent).toBe(machine);

  // @ts-expect-error We get a type error if we try to set the parent to a node
  // that is not its parent
  setParent(machine, config);
});

test('setParentRecursive', () => {
  const id = factory.createId('id');
  const config = factory.createMachineConfig(id);
  const machine = factory.createMachine(config);
  const machineFile = factory.createMachineFile([machine]);

  expect(id.parent).toBeUndefined();
  expect(config.parent).toBeUndefined();
  expect(machine.parent).toBeUndefined();

  setParentRecursive(machineFile);

  expect(id.parent).toBe(config);
  expect(config.parent).toBe(machine);
  expect(machine.parent).toBe(machineFile);
});
