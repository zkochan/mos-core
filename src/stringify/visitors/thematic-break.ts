import {Visitor} from '../visitor'
import repeat from 'repeat-string'

const visitor: Visitor = compiler => {
  const rule = repeat(compiler.options.rule, compiler.options.ruleRepetition)

  if (!compiler.options.ruleSpaces) return rule

  return rule.split('').join(' ')
}

export default visitor
