'use strict';
const fs = require('fs');
const path = require('path');
const parseFile = require('test262-parser').parseFile;
const deps = fs.readFileSync(__dirname + '/compilerdeps.js');

module.exports = function compile(test, options) {
  options = options || {};
  if (!options.test262Dir && !options.includesDir) {
    throw new Error('Need one of test262Dir or includesDir options');
  }

  if (options.test262Dir && !options.includesDir) {
    options.includesDir = path.join(options.test262Dir, 'harness');
  }

  test = parseFile(test);

  if (test.attrs.flags.raw) {
    return test;
  }

  if (test.contents.indexOf('$DONE') === -1) {
    test.contents += '\n;$DONE();';
  }

  let preludeContents = '';
  if (test.attrs.flags.onlyStrict) {
    preludeContents += '"use strict";\n';
  }
  preludeContents += deps;

  const helpers = test.attrs.includes;
  helpers.push('assert.js');

  if (test.attrs.flags.async) {
    helpers.push('doneprintHandle.js');
  }

  for (let i = 0; i < helpers.length; i++) {
    preludeContents += '\n';
    preludeContents += fs.readFileSync(
      path.join(options.includesDir, helpers[i])
    );
  }

  test.contents = preludeContents + test.contents;

  return test;
};
