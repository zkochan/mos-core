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

export type Node = {
  type: string,
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
