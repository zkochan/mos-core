'use strict';

module.exports = tokenizeText;

var ERR_MISSING_LOCATOR = 'Missing locator: ';
var nodeTypes = require('../node-types');

/**
 * Tokenise a text node.
 *
 * @example
 *   tokenizeText(eat, 'foo');
 *
 * @param {function(string)} eat - Eater.
 * @param {string} value - Rest of content.
 * @param {boolean?} [silent] - Whether this is a dry run.
 * @return {Node?|boolean} - `text` node.
 */
function tokenizeText(parser, value, silent) {
  /* istanbul ignore if - never used (yet) */
  if (silent) {
    return true;
  }

  var min = value.length;

  parser.inlineTokenizers.filter(function (tokenizer) {
    return tokenizer.name !== 'inlineText';
  }).forEach(function (tokenizer) {
    var locator = tokenizer.func.locator;

    if (!locator) {
      parser.eat.file.fail(ERR_MISSING_LOCATOR + '`' + tokenizer.name + '`');
      return;
    }

    var position = locator(parser, value, 1);

    if (position !== -1 && position < min) {
      min = position;
    }
  });

  var subvalue = value.slice(0, min);
  var now = parser.eat.now();

  parser.decode(subvalue, now, function (content, position, source) {
    parser.eat(source || content)({
      type: nodeTypes.TEXT,
      value: content
    });
  });
}