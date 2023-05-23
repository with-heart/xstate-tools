import * as factory from './factory';
import { isId, isMachine, isMachineConfig, isMachineFile } from './predicates';

test('isMachineFile', () => {
  expect(isMachineFile(factory.createMachineFile([]))).toBe(true);
});

test('isMachine', () => {
  expect(isMachine(factory.createMachine(factory.createMachineConfig()))).toBe(
    true,
  );
});

test('isMachineConfig', () => {
  expect(isMachineConfig(factory.createMachineConfig())).toBe(true);
  expect(
    isMachineConfig(factory.createMachineConfig(factory.createId('some-id'))),
  ).toBe(true);
});

test('isId', () => {
  expect(isId(factory.createId('some-id'))).toBe(true);
});
