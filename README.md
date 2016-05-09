<!--@h1([pkg.name])-->
# mos-core
<!--/@-->

<!--@blockquote([pkg.description])-->
> Markdown parser
<!--/@-->

<!--@shields.flatSquare('npm', 'travis', 'coveralls')-->
[![NPM version](https://img.shields.io/npm/v/mos-core.svg?style=flat-square)](https://www.npmjs.com/package/mos-core) [![Build status for master](https://img.shields.io/travis/zkochan/mos-core/master.svg?style=flat-square)](https://travis-ci.org/zkochan/mos-core) [![Test coverage for master](https://img.shields.io/coveralls/zkochan/mos-core/master.svg?style=flat-square)](https://coveralls.io/r/zkochan/mos-core?branch=master)
<!--/@-->

<!--@installation()-->
## Installation

```sh
npm install --save mos-core
```
<!--/@-->

## Usage

```js
const mosCore = require('mos-core')
```

<!--@license()-->
## License

[MIT](./LICENSE) © [Zoltan Kochan](http://kochan.io)
<!--/@-->

* * *

<!--@dependencies({ shield: 'flat-square' })-->
## <a name="dependencies">Dependencies</a> [![Dependency status for master](https://img.shields.io/david/zkochan/mos-core/master.svg?style=flat-square)](https://david-dm.org/zkochan/mos-core/master)

- [collapse-white-space](https://github.com/wooorm/collapse-white-space): Replace multiple white-space characters with a single space
- [parse-entities](https://github.com/wooorm/parse-entities): Parse HTML character references: fast, spec-compliant, positional information
- [repeat-string](https://github.com/jonschlinkert/repeat-string): Repeat the given string n times. Fastest implementation for repeating a string.
- [run-async](https://github.com/sboudrias/run-async): Utility method to run function either synchronously or asynchronously using the common `this.async()` style.
- [trim](https://npmjs.org/package/trim): Trim string whitespace
- [unist-util-remove-position](https://github.com/wooorm/unist-util-remove-position): Remove `position`s from a unist tree
- [vfile](https://github.com/wooorm/vfile): Virtual file format for text processing
- [vfile-location](https://github.com/wooorm/vfile-location): Convert between positions (line and column-based) and offsets (range-based) locations in a virtual file

<!--/@-->

<!--@devDependencies({ shield: 'flat-square' })-->
## <a name="dev-dependencies">Dev Dependencies</a> [![devDependency status for master](https://img.shields.io/david/dev/zkochan/mos-core/master.svg?style=flat-square)](https://david-dm.org/zkochan/mos-core/master#info=devDependencies)

- [chai](https://github.com/chaijs/chai): BDD/TDD assertion library for node.js and the browser. Test framework agnostic.
- [cz-conventional-changelog](https://github.com/commitizen/cz-conventional-changelog): Commitizen adapter following the conventional-changelog format.
- [eslint](https://github.com/eslint/eslint): An AST-based pattern checker for JavaScript.
- [eslint-config-standard](https://github.com/feross/eslint-config-standard): JavaScript Standard Style - ESLint Shareable Config
- [eslint-plugin-promise](https://github.com/xjamundx/eslint-plugin-promise): Enforce best practices for JavaScript promises
- [eslint-plugin-standard](https://github.com/xjamundx/eslint-plugin-standard): ESlint Plugin for the Standard Linter
- [ghooks](https://github.com/gtramontina/ghooks): Simple git hooks
- [istanbul](https://github.com/gotwarlost/istanbul): Yet another JS code coverage tool that computes statement, line, function and branch coverage with module loader hooks to transparently add coverage when running tests. Supports all JS coverage use cases including unit tests, server side functional tests
- [mocha](https://github.com/mochajs/mocha): simple, flexible, fun test framework
- [mos](https://github.com/zkochan/mos): A pluggable module that injects content into your markdown files via hidden JavaScript snippets
- [semantic-release](https://github.com/semantic-release/semantic-release): automated semver compliant package publishing
- [validate-commit-msg](https://github.com/kentcdodds/validate-commit-msg): Script to validate a commit message follows the conventional changelog standard

<!--/@-->