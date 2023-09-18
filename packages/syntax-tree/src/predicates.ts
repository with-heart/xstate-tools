import {
  Id,
  Machine,
  MachineConfig,
  MachineFile,
  Node,
  NodeKind,
} from './types';

/**
 * Identifies a node as `Id`.
 *
 * @example
 * declare node: Node
 * if (isId(node)) {
 * 	 // `node` is `Id`
 *   node.value
 * }
 */
export function isId(node: Node): node is Id {
  return node.kind === NodeKind.Id;
}

/**
 * Identifies a node as `Machine`.
 *
 * @example
 * declare node: Node
 * if (isMachine(node)) {
 *   // `node` is `Machine`
 *   machine.config
 * }
 */
export function isMachine(node: Node): node is Machine {
  return node.kind === NodeKind.Machine;
}

/**
 * Identifies a node as `MachineConfig`.
 *
 * @example
 * declare node: Node
 * if (isMachineConfig(node)) {
 *   // `node` is `MachineConfig`
 *   node.id
 * }
 */
export function isMachineConfig(node: Node): node is MachineConfig {
  return node.kind === NodeKind.MachineConfig;
}

/**
 * Identifies a node as `MachineFile`.
 *
 * @example
 * declare node: Node
 * if (isMachineFile(node)) {
 *   // `node` is `MachineFile`
 * 	 node.machines
 * }
 */
export function isMachineFile(node: Node): node is MachineFile {
  return node.kind === NodeKind.MachineFile;
}
