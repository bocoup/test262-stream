# Test262-Stream

A [Node.js](https://nodejs.org) API for traversing [the Test262 test
suite](https://github.com/tc39/test262).

## Usage

```js
var TestStream = require('test262-stream');
var stream = new TestStream('/path/to/test262', {
    // Directory from which to load "includes" files (defaults to the
    // appropriate subdirectory of the provided `test262Dir`
    // Optional. Defaults to './harness'
    includesDir: '/path/to/includes/dir',

    // File system paths refining the set of tests that should be produced;
    // only tests whose source file matches one of these values (in the case of
    // file paths) or is contained by one of these paths (in the case of
    // directory paths) will be created; all paths are interpreted relative to
    // the root of the provided `test262Dir`
    // Optional. Defaults to ['test']
    paths: ['test/built-ins/eval', 'test/language/statements/empty/S12.3_A1.js'],

    // Flag to disable the insertion of code necessary to execute the test
    // (e.g. assertion functions and "include" files); defaults to `false`
    omitRuntime: true,

    // By default, this stream will emit an error if the provided version of
    // Test262 is not supported; this behavior may be disabled by providing a
    // value of the expected version. Use of this option may cause the stream
    // to emit invalid tests; consider updating the library instead.
    acceptVersion: '2.0.0'
  });

stream.on('data', function(test) {
    // the path to the file from which the test was derived, relative to the
    // provided Test262 directory
    console.log(test.file);

    // the complete source text for the test; this contains any "includes"
    // files specified in the frontmatter, "prelude" content if specified (see
    // below), and any "scenario" transformations
    console.log(test.contents);

    // an object representation of the metadata declared in the test's
    // "frontmatter" section
    console.log(test.attrs);

    // the licensing information included within the test (if any)
    console.log(test.copyright);

    // name describing how the source file was interpreted to create the test
    console.log(test.scenario);

    // numeric offset within the `contents` string at which one or more
    // statements may be inserted without necessarily invalidating the test
    console.log(test.insertionIndex);
  });

stream.on('end', function() {
    console.log('No further tests.');
  });

stream.on('error', function(err) {
    console.error('Something went wrong:', err);
  });
```

## License

Copyright 2017, Bocoup LLC under the 3-Clause BSD License (see `LICENSE.txt`)
