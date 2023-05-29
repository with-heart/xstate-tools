import { MachineFile } from '@xstate/tree';

/**
 * Parses the given source text into a `MachineFile` node.
 *
 * Automatically sets `parent` and `pos` values for all nodes in the tree.
 */
export declare function createMachineFile(
  fileName: string,
  sourceText: string,
): MachineFile;
