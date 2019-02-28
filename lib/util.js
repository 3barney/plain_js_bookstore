// Util Functions

var util = {

  /**
   * Verify if a value rep a string
   * @param {string} x 
   */
  isNonEmptyString: function(x) {
    return typeof(x) === "string" && x.trim() !== "";
  },

  /**
   * Return next years value
   */
  nextYear: function() {
    var date = new Date();
    return (date.getFullYear() + 1);
  },
  
  /**
   * Verify a value is an integer or an integer string
   * @param {string} x 
   */
  isIntegerOrIntegerString: function(x) {
    return typeof(x) === "number" && x.toString().search(/^-?[0-9]+$/) == 0
        || typeof(x) === "string" && x.search(/^-?[0-9]+$/) == 0;    
  },

  /**
   * Create a data clone of an object
   * @param {object} obj 
   */
  cloneObject: function(obj) {
    var clone = Object.create(Object.getPrototypeOf(obj));
    for (var p in obj) {
      if (obj.hasOwnProperty(p) && typeof obj[p] != "object") {
        clone[p] = obj[p];
      }
    }
    return clone;
  }
}