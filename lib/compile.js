'use strict';
const fs = require('fs');
const path = require('path');
const builder = require('./builder');
const createScenarios = require('./create-scenarios');

module.exports = function(filePath, options, done) {
  fs.readFile(filePath, 'utf-8', (error, contents) => {
    if (error) {
      done(error);
      return;
    }

    done(null,
      createScenarios(
        builder(
          path.relative(options.test262Dir, filePath),
          contents,
          options
        )
      )
    );
  });
};
