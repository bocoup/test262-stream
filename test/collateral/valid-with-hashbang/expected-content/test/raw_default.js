#!whatever
/*---
description: No license after the hashbang. Contents should have hashbang
features: [hashbang]
flags: [raw]
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
