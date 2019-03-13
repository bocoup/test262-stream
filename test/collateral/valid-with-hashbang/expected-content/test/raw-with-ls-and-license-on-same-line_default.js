#!LS // Copyright (c) 2019, Bocoup LLC. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.


var strict;
try { x = 1; strict = false;} catch(e) { strict = true }

if(strict) {
    y = 1;
} else {
    throw new ReferenceError();
}
