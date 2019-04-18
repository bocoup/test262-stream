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

// This is a customized implementation of `doneprintHandle.js`
function $DONE(){
  if(!arguments[0]) {
    print('Test262:AsyncTestComplete');
  } else {
    print('Error: ' + arguments[0]);
  }
}
// End customized implementation of `doneprintHandle.js`

/*---
description: Async test
flags: [async]
---*/

var p = new Promise(function(resolve) {
  resolve();
});

p.then($DONE, $DONE);
