'use strict';

var decode = require('parse-entities');
var MAILTO_PROTOCOL = 'mailto:';

/**
 * Find a possible auto-link.
 *
 * @example
 *   locateAutoLink('foo <bar') // 4
 *
 * @param {string} value - Value to search.
 * @param {number} fromIndex - Index to start searching at.
 * @return {number} - Location of possible auto-link.
 */
function locateAutoLink(parser, value, fromIndex) {
  return value.indexOf('<', fromIndex);
}

/**
 * Tokenise a URL in carets.
 *
 * @example
 *   tokenizeAutoLink(eat, '<http://foo.bar>')
 *
 * @property {boolean} notInLink
 * @property {Function} locator - Auto-link locator.
 * @param {function(string)} eat - Eater.
 * @param {string} value - Rest of content.
 * @param {boolean?} [silent] - Whether this is a dry run.
 * @return {Node?|boolean} - `link` node.
 */
function tokenizeAutoLink(parser, value, silent) {
  if (value.charAt(0) !== '<') {
    return;
  }

  var subvalue = '';
  var length = value.length;
  var index = 0;
  var queue = '';
  var hasAtCharacter = false;
  var link = '';

  index++;
  subvalue = '<';

  while (index < length) {
    var _character = value.charAt(index);

    if (_character === ' ' || _character === '>' || _character === '@' || _character === ':' && value.charAt(index + 1) === '/') {
      break;
    }

    queue += _character;
    index++;
  }

  if (!queue) {
    return;
  }

  link += queue;
  queue = '';

  var character = value.charAt(index);
  link += character;
  index++;

  if (character === '@') {
    hasAtCharacter = true;
  } else {
    if (character !== ':' || value.charAt(index + 1) !== '/') {
      return;
    }

    link += '/';
    index++;
  }

  while (index < length) {
    character = value.charAt(index);

    if (character === ' ' || character === '>') {
      break;
    }

    queue += character;
    index++;
  }

  character = value.charAt(index);

  if (!queue || character !== '>') {
    return;
  }

  /* istanbul ignore if - never used (yet) */
  if (silent) {
    return true;
  }

  link += queue;
  var content = link;
  subvalue += link + character;
  var now = parser.eat.now();
  now.column++;
  now.offset++;

  if (hasAtCharacter) {
    if (link.substr(0, MAILTO_PROTOCOL.length).toLowerCase() !== MAILTO_PROTOCOL) {
      link = MAILTO_PROTOCOL + link;
    } else {
      content = content.substr(MAILTO_PROTOCOL.length);
      now.column += MAILTO_PROTOCOL.length;
      now.offset += MAILTO_PROTOCOL.length;
    }
  }

  /*
   * Temporarily remove support for escapes in autolinks.
   */

  var parserWithNoEscape = Object.assign({}, parser, {
    inlineTokenizers: parser.inlineTokenizers.filter(function (tok) {
      return tok.name !== 'escape';
    })
  });

  var eater = parserWithNoEscape.eat(subvalue);
  return parserWithNoEscape.renderLink(true, decode(link), content, null, now, parserWithNoEscape.eat).then(function (node) {
    var addedNode = eater(node);
    return addedNode;
  });
}

tokenizeAutoLink.notInLink = true;
tokenizeAutoLink.locator = locateAutoLink;

module.exports = tokenizeAutoLink;