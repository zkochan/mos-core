import {Node, Position, Location} from '../node'

export interface Decoder {
  (value: string, position, handler);
  raw(value: string, position): string;
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
  blockTokenizers: any,
  inlineTokenizers: any,
  eof?: any,
}

export type Parser = SimpleParser & {
  decode: Decoder,
  descape: any,
  tokenizeBlock: Function,
  tokenizeFactory: Function,
  tokenizeInline: Function,
  renderBlockquote (value: string, now: Location): Promise<Node>,
  renderLink (isLink: boolean, url: string, text: string, title?: string, position?: Location): any
  renderFootnote (value: string, position: Location): any,
  renderInline (type: string, value: string, position: Location): any,
  renderListItem (value: string, position: Location): any,
  renderFootnoteDefinition (identifier: string, value: string, position: Location): any,
  renderHeading (value: string, depth: number, position: Location): any,
  parse(contents, opts): Node,
}
