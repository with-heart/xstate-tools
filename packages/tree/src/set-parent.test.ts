import { factory } from '.';
import { setParent, setParentRecursive } from './set-parent';

test('setParent', () => {
  const config = factory.createMachineConfig();
  const machine = factory.createMachine(config);

  setParent(config, machine);

  expect(config.parent).toBe(machine);
});

test('setParentRecursive', () => {
  const id = factory.createId('some-id');
  const config = factory.createMachineConfig(id);
  const machine = factory.createMachine(config);
  const machineFile = factory.createMachineFile([machine]);

  setParentRecursive(machineFile);

  expect(machine.parent).toBe(machineFile);
  expect(config.parent).toBe(machine);
  expect(id.parent).toBe(config);
});
