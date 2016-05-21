'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = renderCodeBlock;

var _nodeTypes = require('../../node-types');

var _nodeTypes2 = _interopRequireDefault(_nodeTypes);

var _trimTrailingLines = require('trim-trailing-lines');

var _trimTrailingLines2 = _interopRequireDefault(_trimTrailingLines);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Create a code-block node.
 *
 * @example
 *   renderCodeBlock('foo()', 'js', now());
 *
 * @param {string?} [value] - Code.
 * @param {string?} [language] - Optional language flag.
 * @param {Function} eat - Eater.
 * @return {Object} - `code` node.
 */
function renderCodeBlock(value, language) {
  return {
    type: _nodeTypes2.default.CODE,
    lang: language || null,
    value: (0, _trimTrailingLines2.default)(value || '')
  };
}