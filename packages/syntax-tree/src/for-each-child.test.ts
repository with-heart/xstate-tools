import { Node, factory, forEachChild, isId } from '@xstate/syntax-tree';
import { forEachChildRecursive } from './for-each-child';

const nodeCallback = jest.fn();
const nodesCallback = jest.fn();

afterEach(() => {
  nodeCallback.mockClear();
  nodesCallback.mockClear();
});

describe('forEachChild', () => {
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
});

describe('forEachChildRecursive', () => {
  test('calls callbacks correctly', () => {
    const callback = jest.fn();

    const machineFile = factory.createMachineFile([
      factory.createMachine(
        factory.createMachineConfig(factory.createId('id-1')),
      ),
      factory.createMachine(
        factory.createMachineConfig(factory.createId('id-2')),
      ),
    ]);

    forEachChildRecursive(machineFile, callback, callback);

    expect(callback).toHaveBeenCalledTimes(7);
    expect(callback).toHaveBeenNthCalledWith(
      1,
      machineFile.machines,
      machineFile,
    );
    expect(callback).toHaveBeenNthCalledWith(
      2,
      machineFile.machines[0],
      machineFile,
    );
    expect(callback).toHaveBeenNthCalledWith(
      3,
      machineFile.machines[0]!.config,
      machineFile.machines[0],
    );
    expect(callback).toHaveBeenNthCalledWith(
      4,
      machineFile.machines[0]!.config.id,
      machineFile.machines[0]!.config,
    );
    expect(callback).toHaveBeenNthCalledWith(
      5,
      machineFile.machines[1],
      machineFile,
    );
    expect(callback).toHaveBeenNthCalledWith(
      6,
      machineFile.machines[1]!.config,
      machineFile.machines[1],
    );
    expect(callback).toHaveBeenNthCalledWith(
      7,
      machineFile.machines[1]!.config.id,
      machineFile.machines[1]!.config,
    );
  });

  test('if nodeCallback returns a value, stops iteration and returns that value', () => {
    // callback which returns the value of an `Id` node
    const nodeCallback = jest.fn((node: Node) => {
      if (isId(node)) {
        return node.value;
      }
      return undefined;
    });

    const machineFile = factory.createMachineFile([
      // machine with config with id
      factory.createMachine(
        factory.createMachineConfig(factory.createId('id')),
      ),
      // machine with config without id
      factory.createMachine(factory.createMachineConfig()),
    ]);

    const result = forEachChildRecursive(machineFile, nodeCallback);

    expect(result).toBe('id');

    expect(nodeCallback).toHaveBeenCalledTimes(3);
    expect(nodeCallback).toHaveBeenNthCalledWith(
      1,
      machineFile.machines[0],
      machineFile,
    );
    expect(nodeCallback).toHaveBeenNthCalledWith(
      2,
      machineFile.machines[0]!.config,
      machineFile.machines[0],
    );
    expect(nodeCallback).toHaveBeenNthCalledWith(
      3,
      machineFile.machines[0]!.config.id,
      machineFile.machines[0]!.config,
    );
  });

  test('if nodesCallback returns a value, stops recursion and returns that value', () => {
    nodesCallback.mockImplementation((nodes: Node[]) => nodes.length);

    const machineFile = factory.createMachineFile([
      factory.createMachine(factory.createMachineConfig()),
      factory.createMachine(factory.createMachineConfig()),
    ]);

    const result = forEachChildRecursive(
      machineFile,
      nodeCallback,
      nodesCallback,
    );

    expect(result).toBe(2);

    expect(nodeCallback).not.toHaveBeenCalled();
    expect(nodesCallback).toHaveBeenCalledTimes(1);
    expect(nodesCallback).toHaveBeenCalledWith(
      machineFile.machines,
      machineFile,
    );
  });
});
