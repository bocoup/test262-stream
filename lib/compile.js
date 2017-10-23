'use strict';
const fs = require('fs');
const path = require('path');
const compile = require('test262-compiler');

const createScenarios = require('./create-scenarios');

const endFrontmatterPattern = /---\*\/\r?\n/g;
const test262StreamMarker = '/* Inserted by Test262Stream */';

module.exports = function (filePath, options, done) {
  fs.readFile(filePath, 'utf-8', (err, contents) => {
    if (err) {
      done(err);
      return;
    }

    // The "compilation" process removes the tests' frontmatter, so a temporary
    // marker must be introduced so the insertion index can be identified
    // following compilation.
    contents = contents
      .replace(endFrontmatterPattern, '$&' + test262StreamMarker);

    const descriptor = { file: filePath, contents };
    const tests = createScenarios(compile(descriptor, options));

    tests.forEach((test) => {
      test.insertionIndex = test.attrs.flags.raw ?
        -1 : test.contents.indexOf(test262StreamMarker);
      test.contents = test.contents.replace(test262StreamMarker, '');

      test.file = path.relative(options.test262Dir, test.file);

      // The following properties are provided by the `test262-parser` module,
      // they are inconsistent and possibly confusing.
      delete test.isATest;
      delete test.async;
      delete test.strictMode;
    });

    done(null, tests);
  });
};
