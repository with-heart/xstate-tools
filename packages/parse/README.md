# `@xstate/parse`

> A library for parsing [`xstate`](https://github.com/statelyai/xstate) code into an [`@xstate/tree`](https://github.com/statelyai/xstate-tools/tree/main/packages/tree) tree.

## Quick start

Install the package:

```sh
npm install @xstate/parse
```

Parse the source text of a file into an `@xstate/tree` tree (with a root node of `MachineFile`):

```ts
import { createMachineFile } from '@xstate/parse';

const sourceText = `
	import { createMachine } from 'xstate';

	createMachine({
		id: 'id-1',
	});
	createMachine({});
	createMachine({
		id: 'id-2',
	});
`;
const machineFile = createMachineFile('code.ts', sourceText);
```

From here, you can use the tree directly:

```ts
const machineIds: string[] = [];

for (const machine of machineFile.machines) {
  if (machine.config.id) {
    machineIds.push(machine.config.id);
  }
}

console.log(`This file has ${machineFile.machines.length} machines`);
console.log(`There are ${machineIds.length} machines with ids`);

if (machineIds.length > 0) {
  console.log(`Here are those ids: ${machineIds.join(',')}`);
}
```

Or consume the tree with tooling provided by `@xstate/tree`:

```ts
import { forEachChild, isMachineId } from '@xstate/tree';

const machineIds: string[] = [];
forEachChild(machineFile, visitNode);

console.log(`This file has ${machineFile.machines.length} machines`);
console.log(`There are ${machineIds.length} machines with ids`);

if (machineIds.length > 0) {
  console.log(`Here are those ids: ${machineIds.join(',')}`);
}

function visitNode(node: Node) {
  if (isMachineId(node)) {
    machineIds.push(node.value);
  }

  forEachChild(node, visitNode);
}
```
