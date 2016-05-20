'use strict'
const repeat = require('repeat-string')
const BREAK = '\n\n'
const INDENT = 4

/**
 * Stringify a footnote definition.
 *
 * @example
 *   var compiler = new Compiler();
 *
 *   compiler.footnoteDefinition({
 *     type: 'footnoteDefinition',
 *     identifier: 'foo',
 *     children: [{
 *       type: 'paragraph',
 *       children: [{
 *         type: 'text',
 *         value: 'bar'
 *       }]
 *     }]
 *   });
 *   // '[^foo]: bar'
 *
 * @param {Object} node - `footnoteDefinition` node.
 * @return {string} - Markdown footnote definition.
 */
module.exports = function (compiler, node) {
  const id = node.identifier.toLowerCase()

  return `[^${id}]: ${compiler.all(node).join(BREAK + repeat(' ', INDENT))}`
}
