export type Location = {
  line: number,
  column: number,
  offset: number,
}

export type Position = {
  start: Location,
  end: Location,
  indent?: number[],
}

export type NodeType = 'thematicBreak'
  | 'html'
  | 'yaml'
  | 'table'
  | 'tableCell'
  | 'tableRow'
  | 'paragraph'
  | 'text'
  | 'code'
  | 'list'
  | 'listItem'
  | 'definition'
  | 'footnoteDefinition'
  | 'heading'
  | 'blockquote'
  | 'link'
  | 'image'
  | 'footnote'
  | 'strong'
  | 'emphasis'
  | 'delete'
  | 'inlineCode'
  | 'break'
  | 'root'

export type Node = {
  type: NodeType,
  position?: Position,
  value?: string,
  children?: Node[],
  title?: string,
  url?: string,
  alt?: string,
  lang?: string,
  identifier?: string,
  ordered?: boolean,
  loose?: boolean,
  start?: number,
  align?: any,
  depth?: number,
  referenceType?: string,
}
