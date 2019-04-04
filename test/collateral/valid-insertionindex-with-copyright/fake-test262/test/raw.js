// Copyright (C) 2048 $ContributorName. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
description: License and correct insertionIndex
flags: [raw]
---*/
var strict;
try { x = 1; strict = false;} catch(e) { strict = true }

if(strict) {
    y = 1;
} else {
    throw new ReferenceError();
}
