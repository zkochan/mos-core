import {ParserAndEater} from './tokenize-factory';

interface Tokenizer {
  (parser: ParserAndEater, value: string, silent: boolean): any,
  notInLink?: boolean,
  onlyAtTop?: boolean,
  notInBlockquote?: boolean,
  onlyAtStart?: boolean,
  locator?: (parser: any, value: string, fromIndex: number) => number,
}

export default Tokenizer
