'use strict';
const fs = require('fs');
const path = require('path');
const compile = require('./compiler');

const createScenarios = require('./create-scenarios');

module.exports = function (filePath, options, done) {
  fs.readFile(filePath, 'utf-8', (err, contents) => {
    if (err) {
      done(err);
      return;
    }

    const descriptor = {
      file: path.relative(options.test262Dir, filePath),
      contents
    };
    const tests = createScenarios(compile(descriptor, options));

    done(null, tests);
  });
};
