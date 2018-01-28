"use strict";


var p = new Promise(function(resolve) {
  resolve();
});

p.then($DONE, $DONE);
