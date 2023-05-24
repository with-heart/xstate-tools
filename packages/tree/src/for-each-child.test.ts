import { Node, factory, isId, isMachine } from '..';
import { forEachChild, visitNode, visitNodes } from '../for-each-child';

describe('forEachChild', () => {
  test('iterates through each child of a node', () => {
    let id: string | undefined = undefined;
    forEachChild(
      factory.createMachineConfig(factory.createId('some-id')),
      nodeCallback,
    );

    expect(id).toBe('some-id');

    function nodeCallback(node: Node) {
      if (isId(node)) {
        id = node.value;
      }
    }
  });

  test('iterates through each node in a child array', () => {
    const ids: string[] = [];
    forEachChild(
      factory.createMachineFile([
        factory.createMachine(
          factory.createMachineConfig(factory.createId('id-1')),
        ),
        factory.createMachine(factory.createMachineConfig()),
        factory.createMachine(
          factory.createMachineConfig(factory.createId('id-2')),
        ),
      ]),
      nodeCallback,
    );

    expect(ids).toEqual(['id-1', 'id-2']);

    function nodeCallback(node: Node) {
      if (isMachine(node) && node.config.id) {
        ids.push(node.config.id.value);
      }
    }
  });

  test('if nodesCallback is provided, calls it with a child array', () => {
    const nodeCallback = jest.fn();

    const ids: string[] = [];
    forEachChild(
      factory.createMachineFile([
        factory.createMachine(
          factory.createMachineConfig(factory.createId('id-1')),
        ),
        factory.createMachine(factory.createMachineConfig()),
        factory.createMachine(
          factory.createMachineConfig(factory.createId('id-2')),
        ),
      ]),
      nodeCallback,
      nodesCallback,
    );

    expect(ids).toEqual(['id-1', 'id-2']);
    expect(nodeCallback).not.toHaveBeenCalled();

    function nodesCallback(nodes: Node[]) {
      for (const node of nodes) {
        if (isMachine(node) && node.config.id) {
          ids.push(node.config.id.value);
        }
      }
    }
  });

  test('if nodeCallback returns a value, exits early and returns that value', () => {
    // callback that returns the id value of a machine if the node is a machine
    // with an id
    const nodeCallback = jest.fn((node: Node) => {
      if (isMachine(node) && node.config.id) {
        return node.config.id.value;
      }
      return;
    });

    const machineWithId = factory.createMachine(
      factory.createMachineConfig(factory.createId('some-id')),
    );
    const machineFile = factory.createMachineFile([
      // callback called with undefined returned
      factory.createMachine(factory.createMachineConfig()),
      // callback called with id returned
      machineWithId,
      // callback not called because value was previously returned
      factory.createMachine(factory.createMachineConfig()),
    ]);

    const result = forEachChild(machineFile, nodeCallback);

    // the id of the machine with an id was returned
    expect(result).toBe('some-id');
    // only called twice because 2nd callback call returned a value
    expect(nodeCallback).toHaveBeenCalledTimes(2);
  });

  // we can't test this yet because we don't have a node with multiple types of
  // children where one is an array
  test.todo(
    'if nodesCallback returns a value, exits early and returns that value',
  );

  test('can be used recursively to iterate through all children in a tree', () => {
    const ids: string[] = [];

    forEachChild(
      factory.createMachineFile([
        factory.createMachine(
          factory.createMachineConfig(factory.createId('id-1')),
        ),
        factory.createMachine(factory.createMachineConfig()),
        factory.createMachine(
          factory.createMachineConfig(factory.createId('id-2')),
        ),
      ]),
      visitNode,
    );

    expect(ids).toEqual(['id-1', 'id-2']);

    function visitNode(node: Node): void {
      if (isId(node)) {
        ids.push(node.value);
      }

      return forEachChild(node, visitNode);
    }
  });
});

describe('visitNode', () => {
  test('returns undefined if node is undefined', () => {
    const callback = jest.fn();

    expect(visitNode(callback, undefined)).toBeUndefined();
    expect(callback).not.toHaveBeenCalled();
  });

  test('returns result of calling callback with the given node', () => {
    const callback = jest.fn(() => 'result');
    const node = factory.createMachine(factory.createMachineConfig());
    const result = visitNode(callback, node);

    expect(callback).toHaveBeenCalledWith(node);
    expect(result).toEqual('result');
  });
});

describe('visitNodes', () => {
  test('returns undefined if nodes is undefined', () => {
    const nodeCallback = jest.fn();

    expect(visitNodes(nodeCallback, undefined, undefined)).toBeUndefined();
    expect(nodeCallback).not.toHaveBeenCalled();
  });

  test('with nodesCallback, returns the result of calling nodesCallback with nodes', () => {
    const nodesCallback = jest.fn(() => 'result');

    const nodes = [
      factory.createMachine(factory.createMachineConfig()),
      factory.createMachine(factory.createMachineConfig()),
      factory.createMachine(factory.createMachineConfig()),
    ];

    expect(visitNodes(jest.fn(), nodesCallback, nodes)).toEqual('result');
    expect(nodesCallback).toHaveBeenCalledWith(nodes);
  });

  describe('without nodesCallback', () => {
    test('iterates through each node calling nodeCallback', () => {
      const nodeCallback = jest.fn();

      const nodes = [
        factory.createMachine(factory.createMachineConfig()),
        factory.createMachine(factory.createMachineConfig()),
        factory.createMachine(factory.createMachineConfig()),
      ];

      visitNodes(nodeCallback, undefined, nodes);

      expect(nodeCallback).toHaveBeenCalledTimes(3);
      expect(nodeCallback).toHaveBeenNthCalledWith(1, nodes[0]);
      expect(nodeCallback).toHaveBeenNthCalledWith(2, nodes[1]);
      expect(nodeCallback).toHaveBeenNthCalledWith(3, nodes[2]);
    });

    test('if nodeCallback returns a value for a node, stops iteration and returns that value', () => {
      const nodeCallback = jest.fn();
      nodeCallback.mockReturnValueOnce(undefined);
      nodeCallback.mockReturnValueOnce('result');
      nodeCallback.mockReturnValueOnce(undefined);

      const nodes = [
        factory.createMachine(factory.createMachineConfig()),
        factory.createMachine(factory.createMachineConfig()),
        factory.createMachine(factory.createMachineConfig()),
      ];

      expect(visitNodes(nodeCallback, undefined, nodes)).toEqual('result');
      expect(nodeCallback).toHaveBeenCalledTimes(2);
      expect(nodeCallback).toHaveBeenNthCalledWith(1, nodes[0]);
      expect(nodeCallback).toHaveBeenNthCalledWith(2, nodes[1]);
    });
  });
});

describe('with node of kind', () => {
  test('Id', () => {
    const callback = jest.fn();
    const id = factory.createId('some-id');

    const result = forEachChild(id, callback);

    expect(result).toBeUndefined();
    expect(callback).not.toHaveBeenCalled();
  });

  test('Machine', () => {
    const callback = jest.fn();
    const config = factory.createMachineConfig();

    forEachChild(factory.createMachine(config), callback);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(config);
  });

  describe('MachineConfig', () => {
    test('with an id', () => {
      const callback = jest.fn();
      const id = factory.createId('some-id');

      forEachChild(factory.createMachineConfig(id), callback);

      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith(id);
    });

    test('with no id', () => {
      const callback = jest.fn();

      forEachChild(factory.createMachineConfig(), callback);

      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe('MachineFile', () => {
    test('containing a single machine', () => {
      const callback = jest.fn();
      const machine = factory.createMachine(factory.createMachineConfig());

      forEachChild(factory.createMachineFile([machine]), callback);

      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith(machine);
    });

    test('with multiple machines', () => {
      const callback = jest.fn();
      const machine1 = factory.createMachine(factory.createMachineConfig());
      const machine2 = factory.createMachine(factory.createMachineConfig());

      forEachChild(factory.createMachineFile([machine1, machine2]), callback);

      expect(callback).toHaveBeenCalledTimes(2);
      expect(callback).toHaveBeenNthCalledWith(1, machine1);
      expect(callback).toHaveBeenNthCalledWith(1, machine2);
    });

    test('with multiple machines + nodesCallback', () => {
      const nodeCallback = jest.fn();
      const nodesCallback = jest.fn();
      const machines = [
        factory.createMachine(factory.createMachineConfig()),
        factory.createMachine(factory.createMachineConfig()),
      ];

      forEachChild(
        factory.createMachineFile(machines),
        nodeCallback,
        nodesCallback,
      );

      expect(nodeCallback).not.toHaveBeenCalled();
      expect(nodesCallback).toHaveBeenCalledTimes(1);
      expect(nodesCallback).toHaveBeenCalledWith(machines);
    });
  });
});
