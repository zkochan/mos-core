'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = tokenizeCode;

var _repeatString = require('repeat-string');

var _repeatString2 = _interopRequireDefault(_repeatString);

var _codeBlock = require('./renderers/code-block');

var _codeBlock2 = _interopRequireDefault(_codeBlock);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CODE_INDENT_LENGTH = 4;
var CODE_INDENT = (0, _repeatString2.default)(' ', CODE_INDENT_LENGTH);

/**
 * Tokenise an indented code block.
 *
 * @example
 *   tokenizeCode(eat, '\tfoo')
 *
 * @param {function(string)} eat - Eater.
 * @param {string} value - Rest of content.
 * @param {boolean?} [silent] - Whether this is a dry run.
 * @return {Node?|boolean} - `code` node.
 */
function tokenizeCode(parser, value, silent) {
  var index = -1;
  var subvalue = '';
  var content = '';
  var subvalueQueue = '';
  var contentQueue = '';
  var indent = void 0;

  while (++index < value.length) {
    var character = value.charAt(index);

    if (indent) {
      indent = false;

      subvalue += subvalueQueue;
      content += contentQueue;
      subvalueQueue = contentQueue = '';

      if (character === '\n') {
        subvalueQueue = contentQueue = character;
      } else {
        subvalue += character;
        content += character;

        while (++index < value.length) {
          character = value.charAt(index);

          if (!character || character === '\n') {
            contentQueue = subvalueQueue = character;
            break;
          }

          subvalue += character;
          content += character;
        }
      }
    } else if (character === ' ' && value.charAt(index + 1) === ' ' && value.charAt(index + 2) === ' ' && value.charAt(index + 3) === ' ') {
      subvalueQueue += CODE_INDENT;
      index += 3;
      indent = true;
    } else if (character === '\t') {
      subvalueQueue += character;
      indent = true;
    } else {
      var blankQueue = '';

      while (character === '\t' || character === ' ') {
        blankQueue += character;
        character = value.charAt(++index);
      }

      if (character !== '\n') {
        break;
      }

      subvalueQueue += blankQueue + character;
      contentQueue += character;
    }
  }

  if (content) {
    if (silent) {
      return true;
    }

    return parser.eat(subvalue)((0, _codeBlock2.default)(content));
  }
}