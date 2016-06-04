declare function collapseWhiteSpace(txt: string): string;

declare module 'collapse-white-space' {
  export default collapseWhiteSpace;
}

declare function ccount(txt: string, substr: string): number;

declare module 'ccount' {
  export default ccount;
}

declare function longestStreak(txt1: string, txt2: string): number;

declare module 'longest-streak' {
  export default longestStreak;
}

declare function runAsync(fn: Function): Function;

declare module 'babel-run-async' {
  export default runAsync;
}

declare function parseEntities(txt: string, opts?: any): string;

declare module 'parse-entities' {
  export default parseEntities;
}

declare function stringifyEntities(txt: string, opts?: any): string;

declare module 'stringify-entities' {
  export default stringifyEntities;
}

declare function vfileLocation(file: any): any;

declare module 'vfile-location' {
  export default vfileLocation;
}

declare function markdownTable(arg1: any, arg2: any): string;

declare module 'markdown-table' {
  export default markdownTable;
}

declare function unistUtilRemovePosition(node: any): void;

declare module 'unist-util-remove-position' {
  export default unistUtilRemovePosition;
}

declare class VFile {
  constructor(m: any)
  warn: Function
  fail: Function
}

declare module 'vfile' {
  export default VFile;
}
