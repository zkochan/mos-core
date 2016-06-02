import nodeTypes from '../../node-types'
import trimTrailingLines from 'trim-trailing-lines'
import {Node} from '../../../node'

/**
 * Create a code-block node.
 *
 * @example
 *   renderCodeBlock('foo()', 'js', now());
 *
 * @param {string?} [value] - Code.
 * @param {string?} [language] - Optional language flag.
 * @param {Function} eat - Eater.
 * @return {Object} - `code` node.
 */
export default function renderCodeBlock (value, language?): Node {
  return {
    type: nodeTypes.CODE,
    lang: language || null,
    value: trimTrailingLines(value || ''),
  }
}
