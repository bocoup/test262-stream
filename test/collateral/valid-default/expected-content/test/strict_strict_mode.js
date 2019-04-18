"use strict";
// This is assert.js

'It has some contents';

/* that
 *
 * should

 * not
 */

`be ${ "modified" }`;

var including, trailing;
whitespace: ;                    

void "end of assert.js";

function Test262Error(message) {
  this.message = message || "";
}

Test262Error.prototype.toString = function () {
  return "Test262Error: " + this.message;
};

var $ERROR;
$ERROR = function $ERROR(message) {
  throw new Test262Error(message);
};

/*---
description: Should not test in sloppy mode
flags: [onlyStrict]
negative:
  phase: runtime
  type: ReferenceError
---*/
x = 5;
$ERROR('Not in strict mode');
