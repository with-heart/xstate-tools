import { factory } from '@xstate/syntax-tree';
import { setParent } from './set-parent';

test('setParent', () => {
  const config = factory.createMachineConfig();
  const machine = factory.createMachine(config);

  // by default, no parent is set factory
  expect(config.parent).toBeUndefined();

  setParent(config, machine);

  // parent is now set
  expect(config.parent).toBe(machine);

  // @ts-expect-error We get a type error if we try to set the parent to a node
  // that is not its parent
  setParent(machine, config);
});
