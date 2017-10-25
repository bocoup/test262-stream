'use strict';
const path = require('path');
const Readable = require('stream').Readable;

const klaw = require('klaw');

const compile = require('./compile');

const paths = Symbol('paths');
const compileOpts = Symbol('includesDir');
const fileStream = Symbol('fileStream');
const onFile = Symbol('onFile');
const pendingOps = Symbol('pendingOps');
const fileStreamDone = Symbol('fileStreamDone');

const fixturePattern = /_FIXTURE\.[jJ][sS]$/;

/**
 * A Node.js readable stream that emits an object value for every test in a
 * given filesystem directory. This object has the following properties:
 *
 * - file {string} - the path to the file from which the test was derived,
 *                   relative to the provided Test262 directory
 * - contents {string} - the complete source text for the test; this contains
 *                       any "includes" files specified in the frontmatter,
 *                       "prelude" content if specified (see below), and any
 *                       "scenario" transformations
 * - attrs {object} - an object representation of the metadata declared in the
 *                    test's YAML-formatted "frontmatter" section
 * - copyright {string} - the licensing information included within the test
 *                        (if any)
 * - scenario {string} - name describing how the source file was interpreted to
 *                       create the test
 * - insertionIndex {number} - numeric offset within the `contents` string at
 *                             which one or more statements may be inserted
 *                             without necessarily invalidating the test
 *
 * @param {string} test262Dir - filesystem path to a directory containing
 *                              Test262
 * @param {object} [options]
 * @param {string} [options.includesDir] - directory from which to load
 *                                         "includes" files (defaults to the
 *                                         appropriate subdirectory of the
 *                                         provided `test262Dir`
 * @param {boolean} [options.skipScenarios] - Defaults to `false`. When set to
 *                                            `true`, only the default scenario
 *                                            is returned, instead of both the
 *                                            default and strict mode scenarios
 * @param {Array<string>} [options.paths] - file system paths refining the set
 *                                          of tests that should be produced;
 *                                          only tests whose source file
 *                                          matches one of these values (in the
 *                                          case of file paths) or is contained
 *                                          by one of these paths (in the case
 *                                          of directory paths) will be
 *                                          created; all paths are interpreted
 *                                          relative to the root of the
 *                                          provided `test262Dir`
 * @param {string} [options.prelude] - string contents to inject into each
 *                                     test that does not carry the `raw`
 *                                     metadata flag; defaults to the empty
 *                                     string (e.g. no injection)
 *
 * @returns {object} readable stream
 */
module.exports = class TestStream extends Readable {
  constructor(test262Dir, options) {
    options = Object.assign({}, options);
    options.objectMode = true;
    super(options);
    this[test262Dir] = test262Dir;
    this[paths] = (options.paths || ['test'])
      .map(relativePath => path.join(test262Dir, relativePath));
    this[compileOpts] = {
      test262Dir,
      includesDir: options.includesDir,
      skipScenarios: options.skipScenarios ? true : false,
    };
    this[fileStream] = null;
    this[pendingOps] = 0;
    this[fileStreamDone] = false;
  }

  _read() {
    if (this[fileStream]) {
      return;
    }

    (function traverse() {
      this[fileStream] = klaw(this[paths].shift());

      this[fileStream].on('data', (item) => this[onFile](item));
      this[fileStream].on('error', (error) => this.emit('error', error));

      this[fileStream].on('end', () => {
        if (this[paths].length) {
          traverse.call(this);
        } else {
          this[fileStreamDone] = true;
        }
      });
    }.call(this));
  }

  [onFile](item) {
    if (!item.stats.isFile()) {
      return;
    }
    if (path.basename(item.path)[0] === '.') {
      return;
    }
    if (fixturePattern.test(item.path)) {
      return;
    }

    this[pendingOps] += 1;

    compile(item.path, this[compileOpts], (err, tests) => {
      this[pendingOps] -= 1;

      if (err) {
        this.emit('error', err);
        return;
      }

      tests.forEach((test) => this.push(test));

      if (this[pendingOps] === 0 && this[fileStreamDone]) {
        this.push(null);
      }
    });
  }
};
