import {
  factory,
  isId,
  isMachine,
  isMachineConfig,
  isMachineFile,
} from '@xstate/syntax-tree';

const id = factory.createId('id');
const config = factory.createMachineConfig(id);
const machine = factory.createMachine(config);
const machineFile = factory.createMachineFile([machine]);

test('isId', () => {
  expect(isId(id)).toBe(true);

  expect(isId(config)).toBe(false);
  expect(isId(machine)).toBe(false);
  expect(isId(machineFile)).toBe(false);
});

test('isMachine', () => {
  expect(isMachine(machine)).toBe(true);

  expect(isMachine(id)).toBe(false);
  expect(isMachine(config)).toBe(false);
  expect(isMachine(machineFile)).toBe(false);
});

test('isMachineConfig', () => {
  expect(isMachineConfig(config)).toBe(true);

  expect(isMachineConfig(id)).toBe(false);
  expect(isMachineConfig(machine)).toBe(false);
  expect(isMachineConfig(machineFile)).toBe(false);
});

test('isMachineFile', () => {
  expect(isMachineFile(machineFile)).toBe(true);

  expect(isMachineFile(id)).toBe(false);
  expect(isMachineFile(config)).toBe(false);
  expect(isMachineFile(machine)).toBe(false);
});
