import eatHTMLComment from '../eat/html-comment'
import eatHTMLCDATA from '../eat/html-cdata'
import eatHTMLProcessingInstruction from '../eat/html-processing-instructions'
import eatHTMLDeclaration from '../eat/html-declaration'
import eatHTMLClosingTag from '../eat/html-closing-tag'
import eatHTMLOpeningTag from '../eat/html-opening-tag'
import Tokenizer from '../tokenizer'

const MIN_CLOSING_HTML_NEWLINE_COUNT = 2

/**
 * Tokenise HTML.
 *
 * @example
 *   tokenizeHTML(eat, '<span>foo</span>');
 *
 * @param {function(string)} eat - Eater.
 * @param {string} value - Rest of content.
 * @param {boolean?} [silent] - Whether this is a dry run.
 * @return {Node?|boolean} - `html` node.
 */
const tokenizeHTML: Tokenizer = function (parser, value, silent) {
  let index = 0
  const length = value.length
  let subvalue = ''
  let character: string

    /*
     * Eat initial spacing.
     */

  while (index < length) {
    character = value.charAt(index)

    if (character !== '\t' && character !== ' ') {
      break
    }

    subvalue += character
    index++
  }

  const offset = index
  value = value.slice(offset)

    /*
     * Try to eat an HTML thing.
     */

  let queue = eatHTMLComment(value, parser.options) ||
        eatHTMLCDATA(value) ||
        eatHTMLProcessingInstruction(value) ||
        eatHTMLDeclaration(value) ||
        eatHTMLClosingTag(value, true) ||
        eatHTMLOpeningTag(value, true)

  if (!queue) {
    return
  }

  if (silent) {
    return true
  }

  subvalue += queue
  index = subvalue.length - offset
  queue = ''

  while (index < length) {
    character = value.charAt(index)

    if (character === '\n') {
      queue += character
    } else if (queue.length < MIN_CLOSING_HTML_NEWLINE_COUNT) {
      subvalue += queue + character
      queue = ''
    } else {
      break
    }

    index++
  }

  return parser.eat(subvalue)({
    type: 'html',
    value: subvalue,
  })
}

export default tokenizeHTML
