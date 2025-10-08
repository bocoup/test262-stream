'use strict';
const fs = require('fs');
const path = require('path');
const TestFile = require('./test-file');

module.exports = function builder(file, contents, options) {
  options = options || {};
  if (!options.test262Dir && !options.includesDir) {
    throw new Error('Need one of test262Dir or includesDir options');
  }

  if (options.test262Dir && !options.includesDir) {
    options.includesDir = path.join(options.test262Dir, 'harness');
  }

  const test = new TestFile(file, contents);

  if (test.attrs.flags.raw || options.omitRuntime) {
    test.insertionIndex = test.attrs.flags.raw ? -1 : 0;
    return test;
  }

  const includes = test.attrs.includes;

  // Prepend assert.js, sta.js, and (if needed) doneprintHandle.js,
  // preserving their relative order.
  // https://github.com/tc39/test262/blob/main/INTERPRETING.md#includes
  if (test.attrs.flags.async) {
    includes.unshift('doneprintHandle.js');
  }
  includes.unshift(
    'assert.js',
    'sta.js'
  );

  let includeContents = '';
  for (let i = 0; i < includes.length; i++) {
    includeContents += fs.readFileSync(
      path.join(options.includesDir, includes[i])
    );
    includeContents += '\n';
  }

  test.contents = includeContents + test.contents;
  test.insertionIndex = includeContents.length;

  return test;
};
