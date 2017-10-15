# Contribution Guidelines

Thank you for your interest in `test262-stream`!

## Development environment

This project relies on [Node.js](https://nodejs.org) version 6 or higher. Once
installed, run the following command in a terminal located at the root of this
project:

    npm install

This will retrieve the Node.js packages necessary to run the project and its
tests.

## Running the tests

Execute the following command in a terminal located at the root of this
project:

    npm test

Please ensure that all tests pass before submitting a patch.

The tests reference static files in the `test/` directory to determine expected
behavior. Contributors who are changing this module's behavior will likely need
to update these expectations. To ease maintenance, the static files can be
automatically updated by setting the environment variable named `RECORD` prior
to running the tests. On Unix-like systems, this can be achieved by running the
tests with the following command:

    RECORD=true npm test

When executed under these conditions, the tests will always pass and the
expectation files will be modified to describe the current behavior. The
modified versions should be verified for correctness and checked in to the
project.
