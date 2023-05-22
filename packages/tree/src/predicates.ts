import {
  Id,
  Machine,
  MachineConfig,
  MachineFile,
  Node,
  NodeKind,
} from './types';

export function isMachineFile(node: Node): node is MachineFile {
  return node.kind === NodeKind.MachineFile;
}

export function isMachine(node: Node): node is Machine {
  return node.kind === NodeKind.Machine;
}

export function isMachineConfig(node: Node): node is MachineConfig {
  return node.kind === NodeKind.MachineConfig;
}

export function isId(node: Node): node is Id {
  return node.kind === NodeKind.Id;
}
