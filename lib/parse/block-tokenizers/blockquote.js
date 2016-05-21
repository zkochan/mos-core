'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = tokenizeBlockquote;

var _trim = require('trim');

var _trim2 = _interopRequireDefault(_trim);

var _tryBlockTokenize = require('../try-block-tokenize');

var _tryBlockTokenize2 = _interopRequireDefault(_tryBlockTokenize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Tokenise a blockquote.
 *
 * @example
 *   tokenizeBlockquote(eat, '> Foo')
 *
 * @param {function(string)} eat - Eater.
 * @param {string} value - Rest of content.
 * @param {boolean?} [silent] - Whether this is a dry run.
 * @return {Node?|boolean} - `blockquote` node.
 */
function tokenizeBlockquote(parser, value, silent) {
  var now = parser.eat.now();
  var indent = parser.indent(now.line);
  var values = [];
  var contents = [];
  var indents = [];
  var index = 0;

  while (index < value.length) {
    var character = value.charAt(index);

    if (character !== ' ' && character !== '\t') {
      break;
    }

    index++;
  }

  if (value.charAt(index) !== '>') {
    return;
  }

  if (silent) {
    return true;
  }

  index = 0;

  return tokenizeEach(index).then(function () {
    index = -1;
    var add = parser.eat(values.join('\n'));

    while (++index < indents.length) {
      indent(indents[index]);
    }

    return add(parser.renderBlockquote(contents.join('\n'), now));
  });

  function tokenizeEach(index) {
    if (index >= value.length) return Promise.resolve();

    var nextIndex = value.indexOf('\n', index);
    var startIndex = index;
    var prefixed = false;

    if (nextIndex === -1) {
      nextIndex = value.length;
    }

    while (index < value.length) {
      var _character = value.charAt(index);

      if (_character !== ' ' && _character !== '\t') {
        break;
      }

      index++;
    }

    if (value.charAt(index) === '>') {
      index++;
      prefixed = true;

      if (value.charAt(index) === ' ') {
        index++;
      }
    } else {
      index = startIndex;
    }

    var content = value.slice(index, nextIndex);

    if (!prefixed && !(0, _trim2.default)(content)) {
      index = startIndex;
      return Promise.resolve();
    }

    var rest = value.slice(index);

    if (!prefixed) {
      if (parser.options.commonmark) {
        return (0, _tryBlockTokenize2.default)(parser, 'code', rest, true).then(function (found) {
          if (found) return index;

          return (0, _tryBlockTokenize2.default)(parser, 'fences', rest, true).then(function (found) {
            if (found) return index;

            return (0, _tryBlockTokenize2.default)(parser, 'heading', rest, true).then(function (found) {
              if (found) return index;

              return (0, _tryBlockTokenize2.default)(parser, 'lineHeading', rest, true).then(function (found) {
                if (found) return index;

                return (0, _tryBlockTokenize2.default)(parser, 'thematicBreak', rest, true).then(function (found) {
                  if (found) return index;

                  return (0, _tryBlockTokenize2.default)(parser, 'html', rest, true).then(function (found) {
                    if (found) return index;

                    return (0, _tryBlockTokenize2.default)(parser, 'list', rest, true).then(function (found) {
                      if (found) return index;

                      return nextNotCommonmark();
                    });
                  });
                });
              });
            });
          });
        });
      }

      return nextNotCommonmark();
    }

    return next();

    function next() {
      var line = startIndex === index ? content : value.slice(startIndex, nextIndex);

      indents.push(index - startIndex);
      values.push(line);
      contents.push(content);

      index = nextIndex + 1;
      return tokenizeEach(index);
    }

    function nextNotCommonmark() {
      if (!parser.options.commonmark) {
        return (0, _tryBlockTokenize2.default)(parser, 'definition', rest, true).then(function (found) {
          if (found) return index;

          return (0, _tryBlockTokenize2.default)(parser, 'footnoteDefinition', rest, true).then(function (found) {
            if (found) return index;

            return next();
          });
        });
      }

      return next();
    }
  }
}