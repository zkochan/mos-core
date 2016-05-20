'use strict';

var block = require('./block');

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
  var values = block(compiler, node).split('\n');
  var result = [];
  var index = -1;

  while (++index < values.length) {
    var value = values[index];
    result[index] = (value ? ' ' : '') + value;
  }

  return '>' + result.join('\n>');
};