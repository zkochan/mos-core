'use strict'
const repeat = require('repeat-string')
const YAML_FENCE_LENGTH = 3

/**
 * Stringify YAML front matter.
 *
 * @example
 *   var compiler = new Compiler();
 *
 *   compiler.yaml({
 *     type: 'yaml',
 *     value: 'foo: bar'
 *   });
 *   // '---\nfoo: bar\n---'
 *
 * @param {Object} node - `yaml` node.
 * @return {string} - Markdown YAML document.
 */
module.exports = function (compiler, node) {
  const delimiter = repeat('-', YAML_FENCE_LENGTH)
  const value = node.value ? '\n' + node.value : ''

  return delimiter + value + '\n' + delimiter
}
