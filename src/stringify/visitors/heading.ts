import {SpecificVisitor} from '../visitor'
import {HeadingNode} from '../../node'
import repeat from 'repeat-string'

const visitor: SpecificVisitor<HeadingNode> = (compiler, node) => {
  const setext = compiler.options.setext
  const closeAtx = compiler.options.closeAtx
  let content = compiler.all(node).join('')

  if (setext && node.depth < 3) {
    return `${content}\n${repeat(node.depth === 1 ? '=' : '-', content.length)}`
  }

  const prefix = repeat('#', node.depth)
  content = `${prefix} ${content}`

  if (closeAtx) {
    content += ` ${prefix}`
  }

  return content
}

export default visitor
