// This is a CUSTOM assert.js

'It has some CUSTOM contents';

/* that
 *
 * should

 * not
 */

`be ${ "modified" }`;

var including, CUSTOM, trailing;
whitespace: ;                    

void "end of CUSTOM assert.js";

// This is a custom implementation of `sta.js`
function Test262Error(message) {
  this.message = message || '';
}

Test262Error.prototype.toString = function() {
  return 'Test262Error: ' + this.message;
};

var $ERROR = function $ERROR(message) {
  throw new Test262Error(message);
};
// End custom implementation of `sta.js`

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
