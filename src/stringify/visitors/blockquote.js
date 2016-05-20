'use strict'
const block = require('./block')

/**
 * Stringify a block quote.
 *
 * @example
 *   var compiler = new Compiler();
 *
 *   compiler.paragraph({
 *     type: 'blockquote',
 *     children: [{
 *       type: 'paragraph',
 *       children: [{
 *         type: 'strong',
 *         children: [{
 *           type: 'text',
 *           value: 'bar'
 *         }]
 *       }]
 *     }]
 *   });
 *   // '> **bar**'
 *
 * @param {Object} node - `blockquote` node.
 * @return {string} - Markdown block quote.
 */
module.exports = function (compiler, node) {
  const values = block(compiler, node).split('\n')
  const result = []
  let index = -1

  while (++index < values.length) {
    const value = values[index]
    result[index] = (value ? ' ' : '') + value
  }

  return '>' + result.join('\n>')
}
