import {Compiler} from './compiler'
import {Node} from '../node'

export type Visitor = (compiler: Compiler, node: Node, parent?: Node) => string
