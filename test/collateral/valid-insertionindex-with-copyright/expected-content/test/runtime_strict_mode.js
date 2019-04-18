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

// Copyright (C) 2048 $ContributorName. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
description: License and correct insertionIndex
---*/
assert(true);
