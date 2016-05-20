'use strict';

var runAsync = require('run-async');

module.exports = function (parser, tokenizerName, subvalue, silent) {
  return runAsync(parser.blockTokenizers.find(function (t) {
    return t.name === tokenizerName;
  }).func)(parser, subvalue, silent);
};