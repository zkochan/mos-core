'use strict';

var decode = require('parse-entities');
var isWhiteSpace = require('../is-white-space');

/*
 * Protocols.
 */

var MAILTO_PROTOCOL = 'mailto:';

var protocolPattern = /https?:\/\/|mailto:/gi;
var beginsWithProtocol = new RegExp('^(' + protocolPattern.source + ')', 'i');

/**
 * Find a possible URL.
 *
 * @example
 *   locateURL('foo http://bar'); // 4
 *
 * @param {string} value - Value to search.
 * @param {number} fromIndex - Index to start searching at.
 * @return {number} - Location of possible URL.
 */
function locateURL(parser, value, fromIndex) {
  if (!parser.options.gfm) {
    return -1;
  }

  protocolPattern.lastIndex = fromIndex;

  var match = protocolPattern.exec(value);

  return !match ? -1 : match.index;
}

/**
 * Tokenise a URL in text.
 *
 * @example
 *   tokenizeURL(eat, 'http://foo.bar');
 *
 * @property {boolean} notInLink
 * @property {Function} locator - URL locator.
 * @param {function(string)} eat - Eater.
 * @param {string} value - Rest of content.
 * @param {boolean?} [silent] - Whether this is a dry run.
 * @return {Node?|boolean} - `link` node.
 */
function tokenizeURL(parser, value, silent) {
  if (!parser.options.gfm) {
    return;
  }

  var match = value.match(beginsWithProtocol);

  if (!match) {
    return;
  }

  var subvalue = match[0];

  var index = subvalue.length;
  var length = value.length;
  var queue = '';
  var parenCount = 0;

  while (index < length) {
    var character = value.charAt(index);

    if (isWhiteSpace(character) || character === '<') {
      break;
    }

    if (~'.,:;"\')]'.indexOf(character)) {
      var nextCharacter = value.charAt(index + 1);

      if (!nextCharacter || isWhiteSpace(nextCharacter)) {
        break;
      }
    }

    if (character === '(' || character === '[') {
      parenCount++;
    }

    if (character === ')' || character === ']') {
      parenCount--;

      if (parenCount < 0) {
        break;
      }
    }

    queue += character;
    index++;
  }

  if (!queue) {
    return;
  }

  subvalue += queue;
  var content = subvalue;

  if (subvalue.indexOf(MAILTO_PROTOCOL) === 0) {
    var position = queue.indexOf('@');

    if (position === -1 || position === length - 1) {
      return;
    }

    content = content.substr(MAILTO_PROTOCOL.length);
  }

  /* istanbul ignore if - never used (yet) */
  if (silent) {
    return true;
  }

  var now = parser.eat.now();

  return parser.eat(subvalue)(parser.renderLink(true, decode(subvalue), content, null, now, parser.eat));
}

tokenizeURL.notInLink = true;
tokenizeURL.locator = locateURL;

module.exports = tokenizeURL;