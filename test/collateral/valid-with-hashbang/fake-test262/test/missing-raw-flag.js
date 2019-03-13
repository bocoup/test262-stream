#!

/*---
description: >
  Missing raw flag will result in the harness/runtime includes being added,
  however doing so will produce invalid test code.
features: [hashbang]
negative:
  phase: parse
  type: SyntaxError
---*/

throw "Test262: This statement should not be evaluated.";
