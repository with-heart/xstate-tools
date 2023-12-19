import ts from 'typescript';
import { Node } from './types';

export function visitEachChild(node: Node, nodeCallback: (node: Node) => Node) {
  return node;
}
