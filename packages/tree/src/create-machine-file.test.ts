import { factory } from '.';
import { createMachineFile } from './create-machine-file';

test('createMachineFile', () => {
  const machineFile = createMachineFile([
    factory.createMachine(
      factory.createMachineConfig(factory.createId('id-1')),
    ),
    factory.createMachine(
      factory.createMachineConfig(factory.createId('id-2')),
    ),
  ]);

  expect(machineFile.machines[0]!.parent).toBe(machineFile);
  expect(machineFile.machines[1]!.parent).toBe(machineFile);

  expect(machineFile.machines[0]!.config.parent).toBe(machineFile.machines[0]);
  expect(machineFile.machines[1]!.config.parent).toBe(machineFile.machines[1]);

  expect(machineFile.machines[0]!.config.id!.parent).toBe(
    machineFile.machines[0]!.config,
  );
  expect(machineFile.machines[1]!.config.id!.parent).toBe(
    machineFile.machines[1]!.config,
  );
});
