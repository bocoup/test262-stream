'use strict';
const fs = require('fs');
const Path = require('path');
const parseFile = require('test262-parser').parseFile;
const deps = fs.readFileSync(__dirname + '/compilerdeps.js');

module.exports = function compile(test, options) {
  options = options || {};
  if (!options.test262Dir && !options.includesDir) {
    throw new Error("Need one of test262Dir or includesDir options");
  }

  if (options.test262Dir && !options.includesDir) {
    options.includesDir = Path.join(options.test262Dir, 'harness');
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

  let helpers = test.attrs.includes;
  helpers.push('assert.js');
  for (var i = 0; i < helpers.length; i++) {
    preludeContents += '\n';
    preludeContents += fs.readFileSync(Path.join(options.includesDir, helpers[i]));
  }

  test.contents = preludeContents + test.contents;

  return test;
};
