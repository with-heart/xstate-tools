import { MachineFile } from './types';

export declare function getLineAndCharacterOfPosition(
  machineFile: MachineFile,
  position: number,
): {
  line: number;
  character: number;
};
