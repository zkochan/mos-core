import {Tokenize} from './tokenize-factory'
import Tokenizer from './tokenizer'
import {Node, NodeType, Location, HeadingNode, ListItemNode} from '../node'
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
  renderBlockquote (value: string, now: Location): Promise<Node>,
  renderLink (isLink: boolean, url: string, text: string, title?: string, position?: Location): Promise<Node>,
  renderFootnote (value: string, position: Location): Promise<Node>,
  renderInline (type: NodeType, value: string, position: Location): Promise<Node>,
  renderListItem (value: string, position: Location): Promise<ListItemNode>,
  renderFootnoteDefinition (identifier: string, value: string, position: Location): Promise<Node>,
  renderHeading (value: string, depth: number, position: Location): Promise<HeadingNode>,
  parse(contents: VFile | string, opts?: ParserOptions): Promise<Node>,
}
