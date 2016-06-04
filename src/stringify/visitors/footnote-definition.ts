import {DefinitionNode} from '../../node'
import {SpecificVisitor} from '../visitor'
import repeat from 'repeat-string'
const BREAK = '\n\n'
const INDENT = 4

const visitor: SpecificVisitor<DefinitionNode> = (compiler, node) => {
  const id = node.identifier.toLowerCase()

  return `[^${id}]: ${compiler.all(node).join(BREAK + repeat(' ', INDENT))}`
}

export default visitor
