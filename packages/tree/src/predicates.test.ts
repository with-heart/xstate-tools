import { isId, isMachine, isMachineConfig, isMachineFile } from './predicates';
import { Id, Machine, MachineConfig, MachineFile, NodeKind } from './types';

test('isMachineFile', () => {
  const node: MachineFile = {
    kind: NodeKind.MachineFile,
    machines: [],
  };
  expect(isMachineFile(node)).toBe(true);
});

test('isMachine', () => {
  const node: Machine = {
    kind: NodeKind.Machine,
    config: {
      kind: NodeKind.MachineConfig,
    },
  };
  expect(isMachine(node)).toBe(true);
});

test('isMachineConfig', () => {
  const node: MachineConfig = { kind: NodeKind.MachineConfig };
  expect(isMachineConfig(node)).toBe(true);
});

test('isId', () => {
  const node: Id = {
    kind: NodeKind.Id,
    value: 'some-id',
  };
  expect(isId(node)).toBe(true);
});
