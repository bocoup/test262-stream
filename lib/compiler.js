'use strict';
const fs = require('fs');
const path = require('path');
const TestFile = require('./test-file');

module.exports = function compile(descriptor, options) {
  options = options || {};
  if (!options.test262Dir && !options.includesDir) {
    throw new Error('Need one of test262Dir or includesDir options');
  }

  if (options.test262Dir && !options.includesDir) {
    options.includesDir = path.join(options.test262Dir, 'harness');
  }

  const test = new TestFile(descriptor);

  test.scenario = null;

  if (test.attrs.flags.raw || options.omitRuntime) {
    test.insertionIndex = test.attrs.flags.raw ? -1 : 0;
    return test;
  }

  const helpers = test.attrs.includes;
  helpers.push('assert.js');
  helpers.push('sta.js');

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
  test.insertionIndex = preludeContents.length + 1;

  return test;
};
