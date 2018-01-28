"use strict";


setTimeout(function() {
  $DONE(new RangeError());
}, 1000);
