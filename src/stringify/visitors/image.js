'use strict'
const encloseURI = require('./enclose-uri')
const encloseTitle = require('./enclose-title')

/**
 * Stringify an image.
 *
 * Is smart about enclosing `url` (see `encloseURI()`) and
 * `title` (see `encloseTitle()`).
 *
 *    ![foo](</fav icon.png> 'My "favourite" icon')
 *
 * Supports named entities in `url`, `alt`, and `title`
 * when in `settings.encode` mode.
 *
 * @example
 *   var compiler = new Compiler();
 *
 *   compiler.image({
 *     type: 'image',
 *     url: 'http://example.png/favicon.png',
 *     title: 'Example Icon',
 *     alt: 'Foo'
 *   });
 *   // '![Foo](http://example.png/favicon.png "Example Icon")'
 *
 * @param {Object} node - `image` node.
 * @return {string} - Markdown image.
 */
module.exports = function (compiler, node) {
  let url = encloseURI(compiler.encode(node.url, node))

  if (node.title) {
    url += ' ' + encloseTitle(compiler.encode(node.title, node))
  }

  const value = `![${compiler.encode(node.alt || '', node)}](${url})`

  return value
}
