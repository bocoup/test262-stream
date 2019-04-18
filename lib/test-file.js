// Based on
// https://github.com/smikes/test262-parser/blob/04902c58d2e2d1b452b34754924b8e75f2e5f3ac/lib/parser.js
// Copyright (C) 2014, Microsoft Corporation. All rights reserved.
// This code is governed by the BSD License found in the LICENSE-MICROSOFT.txt
'use strict';

const yaml = require('js-yaml');
const yamlStart = '/*---';
const yamlEnd = '---*/';

/**
 * Extract copyright message
 *
 * @method extractCopyright
 * @param {Test262File} file - file object
 * @return {string} the copyright string extracted from contents
 * @private
 */
function extractCopyright(test262File) {
  let lines = test262File.contents.split(/\r|\n|\u2028|\u2029/);

  for (let line of lines) {
    // The very first line may be a hashbang, so look at
    // all lines until reaching a line that looks close
    // enough to copyright
    let result = /^(?:(?:\/\/.*)*) Copyright.*/.exec(line);
    if (result && result[0]) {
      return result[0];
    }
  }

  return '';
}

/**
 * Extract YAML frontmatter from a test262 test
 * @method extractYAML
 * @param {Test262File} file - file object
 * @return {string} the YAML frontmatter or empty string if none
 */
function extractYAML(test262File) {
  let start = test262File.contents.indexOf(yamlStart);

  if (start > -1) {
    return test262File.contents.substring(start + 5, test262File.contents.indexOf(yamlEnd));
  }

  return '';
}

/**
 * Extract and parse frontmatter from a test
 * @method loadAttrs
 * @param {Test262File} file - file object
 * @return {Object} - raw, unnormalized attributes
 * @private
 */
function loadAttrs(test262File) {
  let extracted = extractYAML(test262File);

  if (extracted) {
    try {
      return yaml.load(extracted);
    } catch (e) {
      throw new Error(`Error loading frontmatter from file ${test262File.file}\n${e.message}`);
    }
  }

  return {};
}

/**
 * Normalize attributes; ensure that flags, includes exist
 *
 * @method extractAttrs
 * @param {Test262File} file - file object
 * @return {Test262FileAttrs} normalized attributes
 * @private
 */
function extractAttrs(test262File) {
  const attrs = loadAttrs(test262File);
  attrs.flags = attrs.flags || [];
  attrs.flags = attrs.flags.reduce((acc, v) => {
    acc[v] = true;
    return acc;
  }, {});

  attrs.includes = attrs.includes || [];

  return attrs;
}

/**
 * filename
 * @property {string} file
 */
/**
 * test code
 * @property {string} contents
 */
/**
 * parsed, normalized attributes
 * @property {Object} attrs
 */
/**
 * copyright message
 * @property {string} copyright
 */

/**
 * list of harness files to include
 * @attribute {Array} includes
 */
/**
 * test flags;
 * https://github.com/tc39/test262/blob/master/INTERPRETING.md#flags
 * valid values include:
 *   - async
 *   - module
 *   - noStrict
 *   - onlyStrict
 *   - raw
 * @attribute {Object} flags
 */
/**
 * author name
 * @attribute {String} author
 * @optional
 */

class Test262File {
  constructor(file, contents) {
    if (!file) {
      throw new Error('Test262File: missing "file"');
    }

    if (!contents) {
      throw new Error('Test262File: missing "contents"');
    }

    this.file = file;
    this.contents = contents;
    this.attrs = extractAttrs(this);
    this.copyright = extractCopyright(this);
    this.scenario = null;
    this.insertionIndex = null;
  }
}

module.exports = Test262File;
