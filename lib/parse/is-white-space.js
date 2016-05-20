'use strict';
/*
 * Characters.
 */

var C_FORM_FEED = '\f';
var C_CARRIAGE_RETURN = '\r';
var C_VERTICAL_TAB = '\v';
var C_NO_BREAK_SPACE = ' ';
var C_OGHAM_SPACE = ' ';
var C_MONGOLIAN_VOWEL_SEPARATOR = '᠎';
var C_EN_QUAD = ' ';
var C_EM_QUAD = ' ';
var C_EN_SPACE = ' ';
var C_EM_SPACE = ' ';
var C_THREE_PER_EM_SPACE = ' ';
var C_FOUR_PER_EM_SPACE = ' ';
var C_SIX_PER_EM_SPACE = ' ';
var C_FIGURE_SPACE = ' ';
var C_PUNCTUATION_SPACE = ' ';
var C_THIN_SPACE = ' ';
var C_HAIR_SPACE = ' ';
var C_LINE_SEPARATOR = '​\u2028';
var C_PARAGRAPH_SEPARATOR = '​\u2029';
var C_NARROW_NO_BREAK_SPACE = ' ';
var C_IDEOGRAPHIC_SPACE = '　';
var C_ZERO_WIDTH_NO_BREAK_SPACE = '﻿';
/**
 * Check whether `character` is white-space.
 *
 * @param {string} character - Single character to check.
 * @return {boolean} - Whether `character` is white-space.
 */
function isWhiteSpace(character) {
  return character === ' ' || character === C_FORM_FEED || character === '\n' || character === C_CARRIAGE_RETURN || character === '\t' || character === C_VERTICAL_TAB || character === C_NO_BREAK_SPACE || character === C_OGHAM_SPACE || character === C_MONGOLIAN_VOWEL_SEPARATOR || character === C_EN_QUAD || character === C_EM_QUAD || character === C_EN_SPACE || character === C_EM_SPACE || character === C_THREE_PER_EM_SPACE || character === C_FOUR_PER_EM_SPACE || character === C_SIX_PER_EM_SPACE || character === C_FIGURE_SPACE || character === C_PUNCTUATION_SPACE || character === C_THIN_SPACE || character === C_HAIR_SPACE || character === C_LINE_SEPARATOR || character === C_PARAGRAPH_SEPARATOR || character === C_NARROW_NO_BREAK_SPACE || character === C_IDEOGRAPHIC_SPACE || character === C_ZERO_WIDTH_NO_BREAK_SPACE;
}

module.exports = isWhiteSpace;