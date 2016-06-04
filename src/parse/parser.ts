import {Tokenize} from './tokenize-factory'
import Tokenizer from './tokenizer'
import {Node, NodeType, Position, Location, HeadingNode} from '../node'

export interface Decoder {
  (value: string, position: any, handler: any): void;
  raw(value: string, position: any): string;
}

export type SimpleParser = {
  setOptions(options: any): SimpleParser,
  indent(start: number): any,
  getIndent(start: number): number[],
  file?: any,
  toOffset?: any,
  offset?: any,
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
  data: any,
  options: any,
  escape?: any,
  blockTokenizers:  {
    name: string,
    func: Tokenizer,
  }[],
  inlineTokenizers: {
    name: string,
    func: Tokenizer,
  }[],
  eof?: any,
}

export type Parser = SimpleParser & {
  decode: Decoder,
  descape: any,
  tokenizeBlock?: Tokenize,
  tokenizeFactory?: (type: string) => Tokenize,
  tokenizeInline?: Tokenize,
  renderBlockquote (value: string, now: Location): Promise<Node>,
  renderLink (isLink: boolean, url: string, text: string, title?: string, position?: Location): Promise<Node>,
  renderFootnote (value: string, position: Location): any,
  renderInline (type: NodeType, value: string, position: Location): any,
  renderListItem (value: string, position: Location): any,
  renderFootnoteDefinition (identifier: string, value: string, position: Location): any,
  renderHeading (value: string, depth: number, position: Location): Promise<HeadingNode>,
  parse(contents: any, opts: any): Promise<Node>,
}
