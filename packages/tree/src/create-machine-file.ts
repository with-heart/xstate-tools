import { factory } from '.';
import { setParentRecursive } from './set-parent';
import { Machine, MachineFile } from './types';

/**
 * Creates a `MachineFile` node and recursively sets the parent node of each
 * node in the tree.
 */
export function createMachineFile(machines: Machine[]): MachineFile {
  return setParentRecursive(factory.createMachineFile(machines));
}
