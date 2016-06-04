import {ParserAndEater} from './tokenize-factory'
import {Node} from '../node'

interface Tokenizer {
  (parser: ParserAndEater, value: string, silent: boolean): Promise<void | boolean | Node> | void | boolean | Node,
  notInLink?: boolean,
  onlyAtTop?: boolean,
  notInBlockquote?: boolean,
  onlyAtStart?: boolean,
  locator?: (parser: ParserAndEater, value: string, fromIndex: number) => number,
}

export default Tokenizer
