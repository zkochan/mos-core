import 'core-js/fn/array/find'
import 'core-js/fn/array/find-index'
import 'core-js/es6/string'

import parse from './parse'
import blockTokenizers from './parse/block-tokenizers'
import inlineTokenizers from './parse/inline-tokenizers'
import stringify from './stringify'
import visitors from './stringify/visitors'
import escape from './escape'
import Tokenizer from './parse/tokenizer'; // tslint:disable-line
import {Node} from './node' // tslint:disable-line

export default {
  parser: parse,
  blockTokenizers,
  inlineTokenizers,
  compiler: stringify,
  visitors,
  data: {
    escape,
  },
}
