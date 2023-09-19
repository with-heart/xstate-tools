import {
  Id,
  Machine,
  MachineConfig,
  MachineFile,
  Mutable,
  Node,
  NodeKind,
} from './types';

/**
 * Create a mutable node using the given kind.
 *
 * Allows us to create a node without having to define all of its properties
 * (like `parent` which is assigned separately).
 */
function createBaseNode<NodeType extends Node>(
  kind: NodeKind,
): Mutable<NodeType> {
  return { kind } as NodeType;
}

/**
 * Create an `Id` node.
 *
 * @example
 * const id = createId('foo')
 * id.value // => 'foo'
 */
export function createId(value: string): Id {
  const node = createBaseNode<Id>(NodeKind.Id);

  node.value = value;

  return node;
}

/**
 * Create a `Machine` node.
 *
 * @example
 * declare const config: MachineConfig
 * const machine = createMachine(config)
 * machine.config === config // => true
 */
export function createMachine(config: MachineConfig): Machine {
  const node = createBaseNode<Machine>(NodeKind.Machine);

  node.config = config;

  return node;
}

/**
 * Create a `MachineConfig` node.
 *
 * @example
 * declare const id: Id
 * const config = createMachineConfig(id)
 * config.id === id // => true
 */
export function createMachineConfig(id?: Id): MachineConfig {
  const node = createBaseNode<MachineConfig>(NodeKind.MachineConfig);

  node.id = id;

  return node;
}

/**
 * Create a `MachineFile` node.
 *
 * @example
 * declare const machines: Machine[]
 * const machineFile = createMachineFile(machines)
 * machineFile.machines === machines // => true
 */
export function createMachineFile(machines: Machine[]): MachineFile {
  const node = createBaseNode<MachineFile>(NodeKind.MachineFile);

  node.machines = machines;

  return node;
}
