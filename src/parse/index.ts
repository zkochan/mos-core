import {Node, Location, NodeType} from '../node'
import decode from 'parse-entities'
import VFile from 'vfile'
import vfileLocation from 'vfile-location'
import removePosition from 'unist-util-remove-position'
import {raise, clean, validate, stateToggler} from '../utilities'
import {parse as defaultOptions} from '../defaults'
import tokenizeFactory from './tokenize-factory'
import {Decoder, SimpleParser, Parser, Processor, ParserOptions} from './parser'

/**
 * Factory to create an entity decoder.
 *
 * @param {Object} context - Context to attach to, e.g.,
 *   a parser.
 * @return {Function} - See `decode`.
 */
function decodeFactory (context: SimpleParser): Decoder {
  /**
   * Normalize `position` to add an `indent`.
   *
   * @param {Position} position - Reference
   * @return {Position} - Augmented with `indent`.
   */
  function normalize (position: Location) {
    return {
      start: position,
      indent: context.getIndent(position.line),
    }
  }

  /**
   * Handle a warning.
   *
   * @this {VFile} - Virtual file.
   * @param {string} reason - Reason for warning.
   * @param {Position} position - Place of warning.
   * @param {number} code - Code for warning.
   */
  function handleWarning (reason: string, position: Location, code: number): void {
    if (code === 3) {
      return
    }

    context.file.warn(reason, position)
  }

  /**
   * Decode `value` (at `position`) into text-nodes.
   *
   * @param {string} value - Value to parse.
   * @param {Position} position - Position to start parsing at.
   * @param {Function} handler - Node handler.
   */
  const decoder: Decoder = Object.assign(function (value: string, position: Location, handler: Function): void {
    decode(value, {
      position: normalize(position),
      warning: handleWarning,
      text: handler,
      reference: handler,
      textContext: context,
      referenceContext: context,
    })
  }, {
    /**
     * Decode `value` (at `position`) into a string.
     *
     * @param {string} value - Value to parse.
     * @param {Position} position - Position to start
     *   parsing at.
     * @return {string} - Plain-text.
     */
    raw: function (value: string, position: Location): string {
      return decode(value, {
        position: normalize(position),
        warning: handleWarning,
      })
    }
  })

  return decoder
}

type EscapeScope = {
  [key: string]: string[],
}

/**
 * Factory to de-escape a value, based on a list at `key`
 * in `scope`.
 *
 * @example
 *   var scope = {escape: ['a']}
 *   var descape = descapeFactory(scope, 'escape')
 *
 * @param {Object} scope - List of escapable characters.
 * @param {string} key - Key in `map` at which the list
 *   exists.
 * @return {function(string): string} - Function which
 *   takes a value and returns its unescaped version.
 */
function descapeFactory (parser: SimpleParser): Function {
  /**
   * De-escape a string using the expression at `key`
   * in `scope`.
   *
   * @example
   *   var scope = {escape: ['a']}
   *   var descape = descapeFactory(scope, 'escape')
   *   descape('\a \b') // 'a \b'
   *
   * @param {string} value - Escaped string.
   * @return {string} - Unescaped string.
   */
  function descape (value: string): string {
    let prev = 0
    let index = value.indexOf('\\')
    const queue: string[] = []

    while (index !== -1) {
      queue.push(value.slice(prev, index))
      prev = index + 1
      const character = value.charAt(prev)

      /*
       * If the following character is not a valid escape,
       * add the slash.
       */

      if (!character || parser.escape.indexOf(character) === -1) {
        queue.push('\\')
      }

      index = value.indexOf('\\', prev)
    }

    queue.push(value.slice(prev))

    return queue.join('')
  }

  return descape
}

/**
 * Construct a new parser.
 *
 * @example
 *   var parser = new Parser(new VFile('Foo'))
 *
 * @constructor
 * @class {Parser}
 * @param {VFile} file - File to parse.
 * @param {Object?} [options] - Passed to
 *   `Parser#setOptions()`.
 */
function parserFactory (processor: Processor) {

  /*
   * Enter and exit helpers.
   */

  const state = {
    inLink: false,
    atTop: true,
    atStart: true,
    inBlockquote: false,
  }

  const parser: SimpleParser = {
    /**
     * Set options.  Does not overwrite previously set
     * options.
     *
     * @example
     *   var parser = new Parser()
     *   parser.setOptions({gfm: true})
     *
     * @this {Parser}
     * @throws {Error} - When an option is invalid.
     * @param {Object?} [options] - Parse settings.
     * @return {Parser} - `parser`.
     */
    setOptions (options?: ParserOptions) {
      const escape = parser.data.escape
      const current = parser.options
      let key: string

      if (options === null || options === undefined) {
        options = {}
      } else if (typeof options === 'object') {
        options = Object.assign({}, options)
      } else {
        raise(options, 'options')
      }

      for (key in defaultOptions) {
        validate.boolean(options, key, current[key])
      }

      parser.options = options

      if (options.commonmark) {
        parser.escape = escape.commonmark
      } else if (options.gfm) {
        parser.escape = escape.gfm
      } else {
        parser.escape = escape.default
      }

      return parser
    },

    /**
     * Factory to track indentation for each line corresponding
     * to the given `start` and the number of invocations.
     *
     * @param {number} start - Starting line.
     * @return {function(offset)} - Indenter.
     */
    indent (start: number): (offset: number) => void {
      let line = start

      /**
       * Intender which increments the global offset,
       * starting at the bound line, and further incrementing
       * each line for each invocation.
       *
       * @example
       *   indenter(2)
       *
       * @param {number} offset - Number to increment the
       *   offset.
       */
      function indenter (offset: number) {
        parser.offset[line] = (parser.offset[line] || 0) + offset

        line++
      }

      return indenter
    },

    /**
     * Get found offsets starting at `start`.
     *
     * @param {number} start - Starting line.
     * @return {Array.<number>} - Offsets starting at `start`.
     */
    getIndent (start: number): number[] {
      const offset = parser.offset
      const result: number[] = []

      while (++start) {
        if (!(start in offset)) {
          break
        }

        result.push((offset[start] || 0) + 1)
      }

      return result
    },

    /*
     * Expose tokenizers for block-level nodes.
     */

    blockTokenizers: processor.blockTokenizers,

    /*
     * Expose tokenizers for inline-level nodes.
     */

    inlineTokenizers: processor.inlineTokenizers,

    data: processor.data,

    /*
     * Expose `defaults`.
     */
    options: Object.assign({}, defaultOptions),

    state: Object.assign(state, {
      enterLink: stateToggler(state, 'inLink', false),
      exitTop: stateToggler(state, 'atTop', true),
      exitStart: stateToggler(state, 'atStart', true),
      enterBlockquote: stateToggler(state, 'inBlockquote', false),
    }),
  }

  const normalParser: Parser = Object.assign(parser, {
    descape: descapeFactory(parser),
    decode: decodeFactory(parser),
    /**
     * Parse the bound file.
     *
     * @example
     *   new Parser(new File('_Foo_.')).parse()
     *
     * @this {Parser}
     * @return {Object} - `root` node.
     */
    parse (contents: VFile | string, opts?: ParserOptions): Promise<Node> {
      parser.setOptions(opts)

      const file = contents instanceof VFile ? contents : new VFile(contents)
      const value = clean(String(file))
      parser.file = file
      parser.toOffset = vfileLocation(file).toOffset

      /*
       * Add an `offset` matrix, used to keep track of
       * syntax and white space indentation per line.
       */

      parser.offset = {}

      return normalParser.tokenizeBlock(value)
        .then(children => {
          const start: Location = {
            line: 1,
            column: 1,
            offset: 0,
          }
          const node: Node = {
            type: 'root',
            children,
            position: {
              start,
              end: parser.eof || Object.assign({}, start),
            },
          }

          if (!parser.options.position) {
            removePosition(node)
          }

          return node
        })
    },

    /**
     * Create a blockquote node.
     *
     * @example
     *   renderBlockquote('_foo_', eat)
     *
     * @param {string} value - Content.
     * @param {Object} now - Position.
     * @return {Object} - `blockquote` node.
     */
    renderBlockquote (value: string, now: Location): Promise<Node> {
      const exitBlockquote = parser.state.enterBlockquote()

      return normalParser.tokenizeBlock(value, now)
        .then((children: Node[]) => {
          exitBlockquote()
          return <Node>{
            type: 'blockquote',
            children,
          }
        })
    },

    /**
     * Create a link node.
     *
     * @example
     *   renderLink(true, 'example.com', 'example', 'Example Domain', now(), eat)
     *   renderLink(false, 'fav.ico', 'example', 'Example Domain', now(), eat)
     *
     * @param {boolean} isLink - Whether linking to a document
     *   or an image.
     * @param {string} url - URI reference.
     * @param {string} text - Content.
     * @param {string?} title - Title.
     * @param {Object} position - Location of link.
     * @return {Object} - `link` or `image` node.
     */
    renderLink (isLink: boolean, url: string, text: string, title?: string, position?: Location): Promise<Node> {
      const exitLink = parser.state.enterLink()
      const node: {
        type: NodeType,
        title: string,
      } = {
        type: isLink ? 'link' : 'image',
        title: title || null,
      }

      if (isLink) {
        return normalParser.tokenizeInline(text, position)
          .then(children => {
            exitLink()
            return <Node>Object.assign(node, {
              children,
              url
            })
          })
      }
      exitLink()
      return Promise.resolve(<Node>Object.assign(node, {
        url,
        alt: text
        ? normalParser.decode.raw(normalParser.descape(text), position)
        : null
      }))
    },

    /**
     * Create a footnote node.
     *
     * @example
     *   renderFootnote('_foo_', now())
     *
     * @param {string} value - Contents.
     * @param {Object} position - Location of footnote.
     * @return {Object} - `footnote` node.
     */
    renderFootnote (value: string, position: Location): Promise<Node> {
      return normalParser.renderInline('footnote', value, position)
    },

    /**
     * Add a node with inline content.
     *
     * @example
     *   renderInline('strong', '_foo_', now())
     *
     * @param {string} type - Node type.
     * @param {string} value - Contents.
     * @param {Object} position - Location of node.
     * @return {Object} - Node of type `type`.
     */
    renderInline (type: NodeType, value: string, position: Location): Promise<Node> {
      return normalParser.tokenizeInline(value, position)
        .then(children => ({ type, children }))
    },

    /**
     * Create a footnote-definition node.
     *
     * @example
     *   renderFootnoteDefinition('1', '_foo_', now())
     *
     * @param {string} identifier - Unique reference.
     * @param {string} value - Contents
     * @param {Object} position - Definition location.
     * @return {Object} - `footnoteDefinition` node.
     */
     renderFootnoteDefinition (identifier: string, value: string, position: Location): Promise<Node> {
      const exitBlockquote = parser.state.enterBlockquote()

      return normalParser.tokenizeBlock(value, position)
        .then(children => {
          exitBlockquote()
          return <Node>{
            type: 'footnoteDefinition',
            identifier,
            children,
          }
        })
    },
  })
  /*
   * Expose `tokenizeFactory` so dependencies could create
   * their own tokenizers.
   */

  normalParser.tokenizeFactory = (type: string) => tokenizeFactory(normalParser, type)

  /**
   * Block tokenizer.
   *
   * @example
   *   var parser = new Parser()
   *   parser.tokenizeBlock('> foo.')
   *
   * @param {string} value - Content.
   * @return {Array.<Object>} - Nodes.
   */
  normalParser.tokenizeBlock = normalParser.tokenizeFactory('block')

  /**
   * Inline tokenizer.
   *
   * @example
   *   var parser = new Parser()
   *   parser.tokenizeInline('_foo_')
   *
   * @param {string} value - Content.
   * @return {Array.<Object>} - Nodes.
   */

  normalParser.tokenizeInline = normalParser.tokenizeFactory('inline')

  return normalParser.parse
}

export default parserFactory
