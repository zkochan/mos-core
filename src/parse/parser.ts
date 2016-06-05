import {Tokenize} from './tokenize-factory'
import Tokenizer from './tokenizer'
import {Node, Location} from '../node'
import VFile from 'vfile'

export type Processor = {
  blockTokenizers:  Tokenizers,
  inlineTokenizers: Tokenizers,
  data: Object,
}

export interface Decoder {
  (value: string, position: Location, handler: Function): void;
  raw(value: string, position: Location): string;
}

export type Tokenizers = {
  name: string,
  func: Tokenizer,
}[]

export type ParserData = {
  escape?: {
    commonmark?: string[],
    gfm?: string[],
    default?: string[],
  },
}

export type ParserOptions = {
  commonmark?: boolean,
  gfm?: boolean,
  default?: boolean,
  footnotes?: boolean,
  pedantic?: boolean,
  yaml?: boolean,
  position?: boolean,
  breaks?: boolean,
}

export type SimpleParser = {
  setOptions(options: ParserOptions): SimpleParser,
  indent(start: number): (offset: number) => void,
  getIndent(start: number): number[],
  file?: VFile,
  toOffset?: Function,
  offset?: {[line: number]: number},
  state: {
    inLink: boolean,
    atTop: boolean,
    atStart: boolean,
    inBlockquote: boolean,
    enterLink: Function,
    exitTop: Function,
    exitStart: Function,
    enterBlockquote: Function,
  },
  data: ParserData,
  options: ParserOptions,
  escape?: string[],
  blockTokenizers:  Tokenizers,
  inlineTokenizers: Tokenizers,
  eof?: Location,
}

export type Parser = SimpleParser & {
  decode: Decoder,
  descape: Function,
  tokenizeBlock?: Tokenize,
  tokenizeFactory?: (type: string) => Tokenize,
  tokenizeInline?: Tokenize,
  parse(contents: VFile | string, opts?: ParserOptions): Promise<Node>,
}
