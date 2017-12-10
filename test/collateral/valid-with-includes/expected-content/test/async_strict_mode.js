"use strict";
function Test262Error(message) {
    if (message) this.message = message;
}

Test262Error.prototype.name = "Test262Error";

Test262Error.prototype.toString = function () {
    return "Test262Error: " + this.message;
};

function $ERROR(err) {
  if(typeof err === "object" && err !== null && "name" in err) {
      throw err;
  } else {
    throw new Test262Error(err);
  }
}

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

// This is a customized implementation of `doneprintHandle.js`
function $DONE(){
  if(!arguments[0]) {
    print('Test262:AsyncTestComplete');
  } else {
    print('Error: ' + arguments[0]);
  }
}
// End customized implementation of `doneprintHandle.js`


var p = new Promise(function(resolve) {
  resolve();
});

p.then($DONE, $DONE);
