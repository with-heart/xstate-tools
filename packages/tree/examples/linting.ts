import { MachineFile, Node, forEachChild, isId, isMachine } from '@xstate/tree';

const numberStringRegex = /^\d+$/;

// we can use our types, predicates, and forEachChild to traverse and analyze a
// tree, which means we can do useful things like linting!

// let's create a few lint rules:
// - `require-machine-id`: all machines must have an `id`
// - `no-empty-string-ids`: a machine `id` should not be an empty string
// - `no-number-string-ids`: a machine `id` should not be a number string (e.g. '123')

function lint(machineFile: MachineFile) {
  lintNode(machineFile);

  function lintNode(node: Node) {
    // execute each lint rule on the node
    ruleRequireMachineId(node);
    ruleNoEmptyStringIds(node);
    ruleNoNumberStringIds(node);

    // recursively lint all nodes in the tree
    forEachChild(node, lintNode);
  }

  function ruleRequireMachineId(node: Node) {
    if (isMachine(node)) {
      if (!node.config.id) {
        report(node, 'machine is missing an id');
      }
    }
  }

  function ruleNoEmptyStringIds(node: Node) {
    if (isId(node)) {
      if (node.value.trim().length === 0) {
        report(node, 'id should not be an empty string');
      }
    }
  }

  function ruleNoNumberStringIds(node: Node) {
    if (isId(node)) {
      if (numberStringRegex.test(node.value)) {
        report(
          node,
          'id should not be a number string and must include letters',
        );
      }
    }
  }

  function report(node: Node, message: string) {
    const { line, character } = getLineAndCharacterOfPosition(
      machineFile,
      node.pos.start,
    );
    console.log(
      `${machineFile.fileName} (${line + 1},${character + 1}): ${message})`,
    );
  }
}

// not a real implementation because we don't have actual position data for
// nodes yet
function getLineAndCharacterOfPosition(
  _machineFile: MachineFile,
  _position: number,
) {
  return {
    line: 0,
    character: 0,
  };
}
