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

  const helpers = test.attrs.includes;

  helpers.push(
    'assert.js',
    'sta.js'
  );

  if (test.attrs.flags.async) {
    helpers.push('doneprintHandle.js');
  }

  let preludeContents = '';
  for (let i = 0; i < helpers.length; i++) {
    preludeContents += fs.readFileSync(
      path.join(options.includesDir, helpers[i])
    );
    preludeContents += '\n';
  }

  test.contents = preludeContents + test.contents;
  test.insertionIndex = preludeContents.length;

  return test;
};
