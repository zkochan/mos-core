'use strict';

/* eslint-env commonjs */

/*
 * Dependencies.
 */

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var utilities = require('../utilities.js');
var defaultOptions = require('../defaults.js').stringify;
var encodeFactory = require('./encode-factory');
var escapeFactory = require('./escape-factory');
var LIST_BULLETS = require('./list-bullets');

/*
 * Methods.
 */

var raise = utilities.raise;
var validate = utilities.validate;
var mergeable = utilities.mergeable;
var MERGEABLE_NODES = utilities.MERGEABLE_NODES;

/**
 * Construct a state `toggler`: a function which inverses
 * `property` in context based on its current value.
 * The by `toggler` returned function restores that value.
 *
 * @example
 *   var context = {};
 *   var key = 'foo';
 *   var val = true;
 *   context[key] = val;
 *   context.enter = stateToggler(key, val);
 *   context[key]; // true
 *   var exit = context.enter();
 *   context[key]; // false
 *   var nested = context.enter();
 *   context[key]; // false
 *   nested();
 *   context[key]; // false
 *   exit();
 *   context[key]; // true
 *
 * @param {string} key - Property to toggle.
 * @param {boolean} state - It's default state.
 * @return {function(): function()} - Enter.
 */
function stateToggler(key, state) {
  /**
   * Construct a toggler for the bound `key`.
   *
   * @return {Function} - Exit state.
   */
  function enter() {
    var self = this;
    var current = self[key];

    self[key] = !state;

    /**
     * State canceler, cancels the state, if allowed.
     */
    function exit() {
      self[key] = current;
    }

    return exit;
  }

  return enter;
}

/*
 * Constants.
 */

var MINIMUM_RULE_LENGTH = 3;

/*
 * Character combinations.
 */

/*
 * Allowed entity options.
 */

var ENTITY_OPTIONS = {};

ENTITY_OPTIONS.true = true;
ENTITY_OPTIONS.false = true;
ENTITY_OPTIONS.numbers = true;
ENTITY_OPTIONS.escape = true;

/*
 * Allowed horizontal-rule bullet characters.
 */

var THEMATIC_BREAK_BULLETS = {};

THEMATIC_BREAK_BULLETS['*'] = true;
THEMATIC_BREAK_BULLETS['-'] = true;
THEMATIC_BREAK_BULLETS['_'] = true;

/*
 * Allowed emphasis characters.
 */

var EMPHASIS_MARKERS = {};

EMPHASIS_MARKERS['_'] = true;
EMPHASIS_MARKERS['*'] = true;

/*
 * Allowed fence markers.
 */

var FENCE_MARKERS = {};

FENCE_MARKERS['`'] = true;
FENCE_MARKERS['~'] = true;

/*
 * Allowed list-item-indent's.
 */

var LIST_ITEM_INDENTS = {};

var LIST_ITEM_TAB = 'tab';
var LIST_ITEM_ONE = '1';
var LIST_ITEM_MIXED = 'mixed';

LIST_ITEM_INDENTS[LIST_ITEM_ONE] = true;
LIST_ITEM_INDENTS[LIST_ITEM_TAB] = true;
LIST_ITEM_INDENTS[LIST_ITEM_MIXED] = true;

/**
 * Construct a new compiler.
 *
 * @example
 *   var compiler = new Compiler(new File('> foo.'));
 *
 * @constructor
 * @class {Compiler}
 * @param {File} file - Virtual file.
 * @param {Object?} [options] - Passed to
 *   `Compiler#setOptions()`.
 */
function compilerFactory(visitors) {
  var compiler = {
    options: Object.assign({}, defaultOptions),

    /**
     * Set options.  Does not overwrite previously set
     * options.
     *
     * @example
     *   var compiler = new Compiler();
     *   compiler.setOptions({bullet: '*'});
     *
     * @this {Compiler}
     * @throws {Error} - When an option is invalid.
     * @param {Object?} [options] - Stringify settings.
     * @return {Compiler} - `self`.
     */
    setOptions: function setOptions(options) {
      var current = compiler.options;
      var ruleRepetition;
      var key;

      if (options === null || options === undefined) {
        options = {};
      } else if ((typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object') {
        options = Object.assign({}, options);
      } else {
        raise(options, 'options');
      }

      for (key in defaultOptions) {
        validate[_typeof(current[key])](options, key, current[key], maps[key]);
      }

      ruleRepetition = options.ruleRepetition;

      if (ruleRepetition && ruleRepetition < MINIMUM_RULE_LENGTH) {
        raise(ruleRepetition, 'options.ruleRepetition');
      }

      compiler.encode = encodeFactory(String(options.entities));
      compiler.escape = escapeFactory(options);

      compiler.options = options;

      return compiler;
    },


    enterLink: stateToggler('inLink', false),
    enterTable: stateToggler('inTable', false),

    /**
     * Shortcut and collapsed link references need no escaping
     * and encoding during the processing of child nodes (it
     * must be implied from identifier).
     *
     * This toggler turns encoding and escaping off for shortcut
     * and collapsed references.
     *
     * Implies `enterLink`.
     *
     * @param {Compiler} compiler - Compiler instance.
     * @param {LinkReference} node - LinkReference node.
     * @return {Function} - Exit state.
     */
    enterLinkReference: function enterLinkReference(compiler, node) {
      var encode = compiler.encode;
      var escape = compiler.escape;
      var exitLink = compiler.enterLink();

      if (node.referenceType === 'shortcut' || node.referenceType === 'collapsed') {
        compiler.encode = compiler.escape = function (value) {
          return value;
        };
        return function () {
          compiler.encode = encode;
          compiler.escape = escape;
          exitLink();
        };
      } else {
        return exitLink;
      }
    },


    /**
     * Visit a node.
     *
     * @example
     *   var compiler = new Compiler();
     *
     *   compiler.visit({
     *     type: 'strong',
     *     children: [{
     *       type: 'text',
     *       value: 'Foo'
     *     }]
     *   });
     *   // '**Foo**'
     *
     * @param {Object} node - Node.
     * @param {Object?} [parent] - `node`s parent.
     * @return {string} - Compiled `node`.
     */
    visit: function visit(node, parent) {
      /*
       * Fail on unknown nodes.
       */

      if (typeof visitors[node.type] !== 'function') {
        throw new Error('Missing compiler for node of type `' + node.type + '`: `' + node + '`', node);
      }

      return visitors[node.type](compiler, node, parent);
    },


    /**
     * Visit all children of `parent`.
     *
     * @example
     *   var compiler = new Compiler();
     *
     *   compiler.all({
     *     type: 'strong',
     *     children: [{
     *       type: 'text',
     *       value: 'Foo'
     *     },
     *     {
     *       type: 'text',
     *       value: 'Bar'
     *     }]
     *   });
     *   // ['Foo', 'Bar']
     *
     * @param {Object} parent - Parent node of children.
     * @return {Array.<string>} - List of compiled children.
     */
    all: function all(parent) {
      var children = parent.children;
      var values = [];
      var index = 0;
      var length = children.length;
      var mergedLength = 1;
      var node = children[0];
      var next;

      if (length === 0) {
        return values;
      }

      while (++index < length) {
        next = children[index];

        if (node.type === next.type && node.type in MERGEABLE_NODES && mergeable(node) && mergeable(next)) {
          node = MERGEABLE_NODES[node.type].call(compiler, node, next);
        } else {
          values.push(compiler.visit(node, parent));
          node = next;
          children[mergedLength++] = node;
        }
      }

      values.push(compiler.visit(node, parent));
      children.length = mergedLength;

      return values;
    },


    /**
     * Stringify the bound file.
     *
     * @example
     *   var file = new VFile('__Foo__');
     *
     *   file.namespace('mdast').tree = {
     *     type: 'strong',
     *     children: [{
     *       type: 'text',
     *       value: 'Foo'
     *     }]
     *   });
     *
     *   new Compiler(file).compile();
     *   // '**Foo**'
     *
     * @this {Compiler}
     * @return {string} - Markdown document.
     */
    compile: function compile(tree, opts) {
      compiler.setOptions(opts);
      return compiler.visit(tree);
    }
  };

  return compiler.compile;
}

/*
 * Map of applicable enum's.
 */

var maps = {
  'entities': ENTITY_OPTIONS,
  'bullet': LIST_BULLETS,
  'rule': THEMATIC_BREAK_BULLETS,
  'listItemIndent': LIST_ITEM_INDENTS,
  'emphasis': EMPHASIS_MARKERS,
  'strong': EMPHASIS_MARKERS,
  'fence': FENCE_MARKERS
};

/*
 * Expose `stringify` on `module.exports`.
 */

module.exports = compilerFactory;