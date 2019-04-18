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

function $DONE(){
  if(!arguments[0])
    print('Test262:AsyncTestComplete');
  else
    print('Error: ' + arguments[0]);
}

/*---
description: Async negative test
negative:
  phase: runtime
  type: RangeError
flags: [async]
---*/

setTimeout(function() {
  $DONE(new RangeError());
}, 1000);
