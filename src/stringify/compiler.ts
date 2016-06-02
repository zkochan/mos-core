import {Node} from '../node'

export type Compiler = {
  options: any,
  setOptions: Function,
  enterLink: Function,
  enterTable: Function,
  enterLinkReference: Function,
  visit(node: Node, parent?: Node): string,
  all(parent: Node): string[],
  compile(tree, opts): string,
  encode?: Function,
  escape?: Function,
  file?: any,
}
