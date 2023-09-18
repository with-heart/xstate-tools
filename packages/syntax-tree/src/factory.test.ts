import { factory, NodeKind } from '@xstate/syntax-tree';

const id = factory.createId('foo');
const config = factory.createMachineConfig(id);
const machine = factory.createMachine(config);
const machineFile = factory.createMachineFile([machine]);

test('createId', () => {
  expect(id).toEqual({
    kind: NodeKind.Id,
    value: 'foo',
  });
});

test('createMachine', () => {
  expect(machine).toEqual({
    kind: NodeKind.Machine,
    config,
  });
});

describe('createMachineConfig', () => {
  test('with id', () => {
    expect(config).toEqual({
      kind: NodeKind.MachineConfig,
      id,
    });
  });

  test('without id', () => {
    expect(factory.createMachineConfig()).toEqual({
      kind: NodeKind.MachineConfig,
    });
  });
});

test('createMachineFile', () => {
  expect(machineFile).toEqual({
    kind: NodeKind.MachineFile,
    machines: [machine],
  });
});
