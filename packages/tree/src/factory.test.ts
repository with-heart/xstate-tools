import * as factory from './factory';
import { NodeKind } from './types';

test('createMachineFile', () => {
  const machines = [
    factory.createMachine(factory.createMachineConfig()),
    factory.createMachine(factory.createMachineConfig()),
  ];

  expect(factory.createMachineFile(machines)).toEqual({
    kind: NodeKind.MachineFile,
    machines,
  });
  expect(factory.createMachineFile([])).toEqual({
    kind: NodeKind.MachineFile,
    machines: [],
  });
});

test('updateMachineFile', () => {
  const machines = [
    factory.createMachine(factory.createMachineConfig()),
    factory.createMachine(factory.createMachineConfig()),
  ];
  const machineFile = factory.createMachineFile([]);
  const updatedMachineFile = factory.updateMachineFile(machineFile, machines);

  expect(updatedMachineFile).not.toBe(machineFile);
  expect(updatedMachineFile).toEqual({
    kind: NodeKind.MachineFile,
    machines,
  });
});

test('createMachine', () => {
  const config = factory.createMachineConfig();

  expect(factory.createMachine(config)).toEqual({
    kind: NodeKind.Machine,
    config,
  });
});

test('updateMachine', () => {
  const config = factory.createMachineConfig(factory.createId('some-id'));
  const machine = factory.createMachine(factory.createMachineConfig());
  const updatedMachine = factory.updateMachine(machine, config);

  expect(updatedMachine).not.toBe(machine);
  expect(updatedMachine).toEqual({
    kind: NodeKind.Machine,
    config,
  });
});

test('createMachineConfig', () => {
  const id = factory.createId('some-id');

  expect(factory.createMachineConfig(factory.createId('some-id'))).toEqual({
    kind: NodeKind.MachineConfig,
    id,
  });
  expect(factory.createMachineConfig()).toEqual({
    kind: NodeKind.MachineConfig,
  });
});

test('updateMachineConfig', () => {
  const id = factory.createId('some-id');
  const machineConfig = factory.createMachineConfig();
  const updatedMachineConfig = factory.updateMachineConfig(machineConfig, id);

  expect(updatedMachineConfig).not.toBe(machineConfig);
  expect(updatedMachineConfig).toEqual({
    kind: NodeKind.MachineConfig,
    id,
  });
});

test('createId', () => {
  expect(factory.createId('some-id')).toEqual({
    kind: NodeKind.Id,
    value: 'some-id',
  });
});

test('updateId', () => {
  const id = factory.createId('id');
  const updatedId = factory.updateId(id, 'new-id');

  expect(updatedId).not.toBe(id);
  expect(updatedId).toEqual({
    kind: NodeKind.Id,
    value: 'new-id',
  });
});
