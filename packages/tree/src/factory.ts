import { Id, Machine, MachineConfig, MachineFile, NodeKind } from './types';

export function createMachineFile(machines: Machine[]): MachineFile {
  return {
    kind: NodeKind.MachineFile,
    machines,
  };
}

export function updateMachineFile(
  node: MachineFile,
  machines: Machine[],
): MachineFile {
  return node.machines === machines ? node : createMachineFile(machines);
}

export function createMachine(config: MachineConfig): Machine {
  return {
    kind: NodeKind.Machine,
    config,
  };
}

export function updateMachine(node: Machine, config: MachineConfig): Machine {
  return node.config === config ? node : createMachine(config);
}

export function createMachineConfig(id?: Id): MachineConfig {
  return {
    kind: NodeKind.MachineConfig,
    id,
  };
}

export function updateMachineConfig(
  node: MachineConfig,
  id?: Id,
): MachineConfig {
  return node.id === id ? node : createMachineConfig(id);
}

export function createId(value: string): Id {
  return {
    kind: NodeKind.Id,
    value,
  };
}

export function updateId(node: Id, value: string): Id {
  return node.value === value ? node : createId(value);
}
