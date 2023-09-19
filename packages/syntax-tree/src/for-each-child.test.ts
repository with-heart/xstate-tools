import { factory, forEachChild } from '@xstate/syntax-tree';

const nodeCallback = jest.fn();
const nodesCallback = jest.fn();

afterEach(() => {
  nodeCallback.mockClear();
  nodesCallback.mockClear();
});

describe('Id', () => {
  const id = factory.createId('id');

  test('no children so does not call callbacks and result is undefined', () => {
    const result = forEachChild(id, nodeCallback, nodesCallback);

    expect(nodeCallback).not.toHaveBeenCalled();
    expect(nodesCallback).not.toHaveBeenCalled();
    expect(result).toBeUndefined();
  });
});

describe('Machine', () => {
  const config = factory.createMachineConfig();
  const machine = factory.createMachine(config);

  test('calls callbacks with children', () => {
    forEachChild(machine, nodeCallback, nodesCallback);

    expect(nodeCallback).toHaveBeenNthCalledWith(1, config);
    expect(nodesCallback).not.toHaveBeenCalled();
  });

  test('returns result of nodeCallback if not undefined', () => {
    nodeCallback.mockReturnValueOnce('foo');

    const result = forEachChild(machine, nodeCallback, nodesCallback);
    expect(result).toEqual('foo');
  });
});

describe('MachineConfig', () => {
  const id = factory.createId('id');
  const config = factory.createMachineConfig(id);

  test('calls callbacks with children', () => {
    forEachChild(config, nodeCallback, nodesCallback);

    expect(nodeCallback).toHaveBeenNthCalledWith(1, id);
    expect(nodesCallback).not.toHaveBeenCalled();
  });

  test('returns result of nodeCallback if not undefined', () => {
    nodeCallback.mockReturnValueOnce('foo');

    const result = forEachChild(config, nodeCallback, nodesCallback);
    expect(result).toEqual('foo');
  });
});

describe('MachineFile', () => {
  const machine1 = factory.createMachine(
    factory.createMachineConfig(factory.createId('id')),
  );
  const machine2 = factory.createMachine(factory.createMachineConfig());
  const machineFile = factory.createMachineFile([machine1, machine2]);

  test('calls nodesCallback with array of machines if provided', () => {
    forEachChild(machineFile, nodeCallback, nodesCallback);

    expect(nodeCallback).not.toHaveBeenCalled();
    expect(nodesCallback).toHaveBeenNthCalledWith(1, [machine1, machine2]);
  });

  test('calls nodeCallback for each node in array if nodesCallback not provided', () => {
    forEachChild(machineFile, nodeCallback);

    expect(nodeCallback).toHaveBeenNthCalledWith(1, machine1);
    expect(nodeCallback).toHaveBeenNthCalledWith(2, machine2);
  });

  test('returns result of nodesCallback if not undefined', () => {
    nodesCallback.mockReturnValueOnce('foo');

    const result = forEachChild(machineFile, nodeCallback, nodesCallback);

    expect(result).toEqual('foo');
  });

  test('stops iterating and returns result of nodeCallback if not undefined and nodesCallback not provided', () => {
    nodeCallback.mockReturnValueOnce('foo');

    const result = forEachChild(machineFile, nodeCallback);

    expect(result).toEqual('foo');
    expect(nodeCallback).toHaveBeenCalledTimes(1);
  });
});
