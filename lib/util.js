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
  },
  /**
   * Create option elements from a map of objects
   * and insert them into a selection list element
   *
   * @param {object} objMap  A map of objects
   * @param {object} selEl  A select(ion list) element
   * @param {string} stdIdProp  The standard identifier property
   * @param {string} displayProp [optional]  A property supplying the text 
   *                 to be displayed for each object
   */
  fillSelectWithOptions: function(objMap, selEl, stdIdProp, displayProp) {
    var optionElement = null, obj = null, i = 0, keys = Object.keys(objMap);

    for (i=0; i< keys.length; i++) {
      obj = objMap[keys[i]];
      obj.index = i+1; // resp select list index
      optionElement = document.createElement("option");
      optionElement.value = obj[stdIdProp];

      if (displayProp) {
        // show the values of displayProp in the select list
        optionElement.text = obj[displayProp];
      } else {
        // show the values of stdIdProp in the select list
        optionElement.text = obj[displayProp];
      }
      selEl.add(optionElement, null);
    }
  }
  
}