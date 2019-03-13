#!LS {// a U+2028 <LS> LINE SEPARATOR is to the immediate left of "{//"
}

var strict;
try { x = 1; strict = false;} catch(e) { strict = true }

if(strict) {
    y = 1;
} else {
    throw new ReferenceError();
}
