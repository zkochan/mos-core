import {Visitor} from '../visitor'
import label from './label'

const visitor: Visitor = (compiler, node) => {
  const alt = compiler.encode(node.alt, node) || ''

  return `![${alt}]${label(node)}`
}

export default visitor
