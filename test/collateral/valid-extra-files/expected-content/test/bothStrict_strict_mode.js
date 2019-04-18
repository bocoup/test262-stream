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
description: Should test in both modes
features: [var, try, if]
negative:
  phase: runtime
  type: ReferenceError
---*/
var strict;
try { x = 1; strict = false;} catch(e) { strict = true }

if(strict) {
    y = 1;
} else {
    throw new ReferenceError();
}
