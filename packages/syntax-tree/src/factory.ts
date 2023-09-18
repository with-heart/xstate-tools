import { Id, Machine, MachineConfig, MachineFile, NodeKind } from './types';

/**
 * Create an `Id` node.
 *
 * @example
 * const id = createId('foo')
 * id.value // => 'foo'
 */
export function createId(value: string): Id {
  return {
    kind: NodeKind.Id,
    value,
  };
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
  return {
    kind: NodeKind.Machine,
    config,
  };
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
  return {
    kind: NodeKind.MachineConfig,
    id,
  };
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
  return {
    kind: NodeKind.MachineFile,
    machines,
  };
}
