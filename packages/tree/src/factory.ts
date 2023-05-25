import {
  Id,
  Machine,
  MachineConfig,
  MachineFile,
  Mutable,
  Node,
  NodeKind,
} from './types';

const baseCreateNode = <N extends Node>(kind: N['kind']): Mutable<N> =>
  ({ kind } as N);

export function createMachineFile(machines: Machine[]): MachineFile {
  const node = baseCreateNode<MachineFile>(NodeKind.MachineFile);

  node.machines = machines;

  return node;
}

export function updateMachineFile(
  node: MachineFile,
  machines: Machine[],
): MachineFile {
  return node.machines === machines ? node : createMachineFile(machines);
}

export function createMachine(config: MachineConfig): Machine {
  const node = baseCreateNode<Machine>(NodeKind.Machine);

  node.config = config;

  return node;
}

export function updateMachine(node: Machine, config: MachineConfig): Machine {
  return node.config === config ? node : createMachine(config);
}

export function createMachineConfig(id?: Id): MachineConfig {
  const node = baseCreateNode<MachineConfig>(NodeKind.MachineConfig);

  node.id = id;

  return node;
}

export function updateMachineConfig(
  node: MachineConfig,
  id?: Id,
): MachineConfig {
  return node.id === id ? node : createMachineConfig(id);
}

export function createId(value: string): Id {
  const node = baseCreateNode<Id>(NodeKind.Id);

  node.value = value;

  return node;
}

export function updateId(node: Id, value: string): Id {
  return node.value === value ? node : createId(value);
}
