// This is a custom implementation of `sta.js`
function Test262Error(message) {
  this.message = message || '';
}

Test262Error.prototype.toString = function() {
  return 'Test262Error: ' + this.message;
};

var $ERROR = function $ERROR(message) {
  throw new Test262Error(message);
};
// End custom implementation of `sta.js`
