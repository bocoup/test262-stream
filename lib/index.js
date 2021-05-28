'use strict';

const fs = require('fs');
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
const acceptVersion = Symbol('acceptVersion');

const supportedVersion = /^[12345]\./;
const fixturePattern = /_FIXTURE/;

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
 * @param {boolean} [options.omitRuntime] - flag to disable the insertion of
 *                                          code necessary to execute the test
 *                                          (e.g. assertion functions and
 *                                          "include" files); defaults to
 *                                          `false`
 * @param {string} [options.acceptVersion] - by default, this stream will emit
 *                                           an error if the provided version
 *                                           of Test262 is not supported; this
 *                                           behavior may be disabled by
 *                                           providing a value of the expected
 *                                           version. Use of this option may
 *                                           cause the stream to emit invalid
 *                                           tests; consider updating the
 *                                           library instead.
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
      omitRuntime: !!options.omitRuntime
    };
    this[fileStream] = null;
    this[pendingOps] = 0;
    this[fileStreamDone] = false;
    this[acceptVersion] = options.acceptVersion;
  }

  _read() {
    if (this[fileStream]) {
      return;
    }
    const packagePath = path.join(this[compileOpts].test262Dir, 'package.json');

    fs.readFile(packagePath, 'utf-8', (error, contents) => {
      if (error) {
        if (error.code === 'ENOENT') {
          this.traverse();
          return;
        }

        this.emit('error', error);
        return;
      }

      let packageData;

      try {
        packageData = JSON.parse(contents);
      } catch (error) {
        this.emit('error', error);
        return;
      }

      const version = packageData.version;

      if (!supportedVersion.test(version) && this[acceptVersion] !== version) {
        this.emit(
          'error', new Error(`Unsupported version of Test262: '${version}'`)
        );
        return;
      }

      this.traverse();
    });
  }

  traverse() {
    this[fileStream] = klaw(this[paths].shift());

    this[fileStream].on('data', (item) => this[onFile](item));
    this[fileStream].on('error', (error) => this.emit('error', error));

    this[fileStream].on('end', () => {
      if (this[paths].length) {
        this.traverse();
      } else {
        this[fileStreamDone] = true;

        // If the final file visited is not a test and compilation for all
        // other tests has completed, the stream should signal completion.
        if (this[pendingOps] === 0) {
          this.push(null);
        }
      }
    });
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
