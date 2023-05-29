import { MachineFile, NodeKind } from '@xstate/tree';
import { createMachineFile } from './create-machine-file';

test.skip('createMachineFile', () => {
  const source = `
    import { createMachine } from 'xstate';

    createMachine({
      id: 'some-id',
    });
  `;
  const machineFile = createMachineFile('test.ts', source);

  expect(machineFile).toEqual<MachineFile>({
    kind: NodeKind.MachineFile,
    parent: undefined as never,
    pos: {
      start: 0,
      end: 77,
    },
    fileName: 'test.ts',
    sourceText: source,
    machines: [
      {
        kind: NodeKind.Machine,
        parent: machineFile,
        pos: {
          start: 41,
          end: 76,
        },
        config: {
          kind: NodeKind.MachineConfig,
          parent: machineFile.machines[0]!,
          pos: {
            start: 55,
            end: 75,
          },
          id: {
            kind: NodeKind.Id,
            parent: machineFile.machines[0]!.config,
            pos: {
              start: 59,
              end: 61,
            },
            value: 'some-id',
          },
        },
      },
    ],
  });
});
