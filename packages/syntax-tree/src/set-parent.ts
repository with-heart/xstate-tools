import { Mutable, Node } from './types';

/**
 * Bypasses immutability and directly sets the `parent` property of a node.
 *
 * @example
 * const config = factory.createMachineConfig();
 * const machine = factory.createMachine(config);
 *
 * config.parent === undefined // true
 * setParent(config, machine)
 * config.parent === machine // true
 */
export function setParent<NodeType extends Node>(
  child: NodeType,
  parent: NodeType['parent'] | undefined,
): NodeType;
export function setParent<NodeType extends Node>(
  child: NodeType | undefined,
  parent: NodeType['parent'] | undefined,
): NodeType | undefined {
  if (child && parent) {
    (child as Mutable<NodeType>).parent = parent;
  }
  return child;
}
