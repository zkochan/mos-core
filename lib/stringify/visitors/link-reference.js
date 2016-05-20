'use strict';

var label = require('./label');
var entityPrefixLength = require('../entity-prefix-length');

/*
 * Punctuation characters.
 */

var PUNCTUATION = /[-!"#$%&'()*+,.\/:;<=>?@\[\\\]^`{|}~_]/;

/**
 * For shortcut and collapsed reference links, the contents
 * is also an identifier, so we need to restore the original
 * encoding and escaping that were present in the source
 * string.
 *
 * This function takes the unescaped & unencoded value from
 * shortcut's child nodes and the identifier and encodes
 * the former according to the latter.
 *
 * @example
 *   copyIdentifierEncoding('a*b', 'a\\*b*c')
 *   // 'a\\*b*c'
 *
 * @param {string} value - Unescaped and unencoded stringified
 *   link value.
 * @param {string} identifier - Link identifier.
 * @return {string} - Encoded link value.
 */
function copyIdentifierEncoding(value, identifier) {
  var index = 0;
  var position = 0;
  var result = [];

  while (index < value.length) {
    /*
     * Take next non-punctuation characters from `value`.
     */

    var start = index;

    while (index < value.length && !PUNCTUATION.test(value.charAt(index))) {
      index += 1;
    }

    result.push(value.slice(start, index));

    /*
     * Advance `position` to the next punctuation character.
     */
    while (position < identifier.length && !PUNCTUATION.test(identifier.charAt(position))) {
      position += 1;
    }

    /*
     * Take next punctuation characters from `identifier`.
     */
    start = position;

    while (position < identifier.length && PUNCTUATION.test(identifier.charAt(position))) {
      if (identifier.charAt(position) === '&') {
        position += entityPrefixLength(identifier.slice(position));
      }
      position += 1;
    }

    result.push(identifier.slice(start, position));

    /*
     * Advance `index` to the next non-punctuation character.
     */
    while (index < value.length && PUNCTUATION.test(value.charAt(index))) {
      index += 1;
    }
  }

  return result.join('');
}

/**
 * Stringify a link reference.
 *
 * See `label()` on how reference labels are created.
 *
 * @example
 *   var compiler = new Compiler();
 *
 *   compiler.linkReference({
 *     type: 'linkReference',
 *     referenceType: 'collapsed',
 *     identifier: 'foo',
 *     children: [{
 *       type: 'text',
 *       value: 'Foo'
 *     }]
 *   });
 *   // '[Foo][]'
 *
 * @param {Object} node - `linkReference` node.
 * @return {string} - Markdown link reference.
 */
module.exports = function (compiler, node) {
  var exitLinkReference = compiler.enterLinkReference(compiler, node);
  var value = compiler.all(node).join('');

  exitLinkReference();

  if (node.referenceType === 'shortcut' || node.referenceType === 'collapsed') {
    value = copyIdentifierEncoding(value, node.identifier);
  }

  return '[' + value + ']' + label(node);
};