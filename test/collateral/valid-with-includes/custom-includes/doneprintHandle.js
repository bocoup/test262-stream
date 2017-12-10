// This is a customized implementation of `doneprintHandle.js`
function $DONE(){
  if(!arguments[0]) {
    print('Test262:AsyncTestComplete');
  } else {
    print('Error: ' + arguments[0]);
  }
}
// End customized implementation of `doneprintHandle.js`
