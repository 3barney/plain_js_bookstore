'use strict'
// Support functions for older browsers

/**
 * Implements the trim function for browsers 
 * that don't support it natively
 */
if (!String.prototype.trim) {
  String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g,'');
  }
}

if (!Number.isInteger) {
  Number.isInteger = function isInteger (nVal) {
    return typeof nVal === "number" && isFinite(nVal) &&
      nVal > -9007199254740992 && nVal < 9007199254740992 &&
      Math.floor(nVal) == nVal;
  };
}

if (!String.prototype.includes) {
  String.prototype.includes = function() {
    return String.prototype.indexOf.apply(this, arguments) !== -1
  }
}

/**
 * Compute the max/min of an array
 * Notice that apply requires a context object, which is not really used
 * in the case of a static function such as Math.max
 */
Array.max = function(array) {
  return Math.max.apply(Math, array);
}

Array.min = function(array) {
  return Math.min.apply(Math, array);
}

// Array Cloning
Array.prototype.clone = function() {
  return this.slice(0);
}

// Check array equality
Array.prototype.isEqualTo = function(a2) {
  return (this.length == a2.length) && this.every( function(el, i) {
    return el === as[i];
  });
}
