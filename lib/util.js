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
   * Creates a "clone" of an object that is an instance of a model class
   *
   * @param {object} obj
   */
  cloneObject: function (obj) {
    var p="", val, 
        clone = Object.create( Object.getPrototypeOf(obj));
    for (p in obj) {
      if (obj.hasOwnProperty(p)) {
        val = obj[p];
        if (typeof val === "number" ||
            typeof val === "string" ||
            typeof val === "boolean" ||
            val instanceof Date ||
            // typed object reference
            typeof val === "object" && !!val.constructor ||
            // list of data values
            Array.isArray( val) &&
              !val.some( function (el) {
                return typeof el === "object";
              }) ||
            // list of typed object references
            Array.isArray( val) &&
              val.every( function (el) {
                return (typeof val === "object" && !!val.constructor);  
              })
            ) {
          if (Array.isArray( val)) clone[p] = val.slice(0);
          else clone[p] = val;
        }
        // else clone[p] = cloneObject(val);
      }
    }
    return clone;
  },
  /**
   * Create a DOM option element
   * 
   * @param {string} val
   * @param {string} txt 
   * @param {string} classValues [optional]
   * 
   * @return {object}
   */
  createOption: function( val, txt, classValues) {
    var el = document.createElement("option");
    el.value = val;
    el.text = txt;
    if (classValues) el.className = classValues;
    return el;
  },
  /**
   * Fill a select element with option elements created from an 
   * associative array of objects 
   *
   * @param {object} selectEl  A select(ion list) element
   * @param {object|array} selectionRange  A map of objects or an array list
   * @param {string} keyProp [optional]  The standard identifier property
   * @param {object} optPar [optional]  A record of optional parameter slots
   *                 including optPar.displayProp and optPar.selection
   */
  fillSelectWithOptions: function (selectEl, selectionRange, optPar) {
    var i=0, optionEl=null, options=[], key="", obj=null, displayProp="";
    // delete old contents
    selectEl.innerHTML = "";
    // create "no selection yet" entry
    if (!selectEl.multiple) {
      selectEl.add( util.createOption(""," --- "));
    }
    // create option elements from object property values
    options = Array.isArray( selectionRange) ? selectionRange : 
        Object.keys( selectionRange);
    for (i=0; i < options.length; i++) {
      if (Array.isArray( selectionRange)) {
        optionEl = util.createOption( i+1, options[i]);        
        if (selectEl.multiple && optPar && optPar.selection && 
            optPar.selection.includes(i+1)) {
          // flag the option element with this value as selected
          optionEl.selected = true;
        }      
      } else {
        key = options[i];
        obj = selectionRange[key];
        if (!selectEl.multiple) obj.index = i+1;  // store selection list index
        if (optPar && optPar.displayProp) displayProp = optPar.displayProp;
        else displayProp = optPar.keyProp;
        optionEl = util.createOption( key, obj[displayProp]);
        // if invoked with a selection argument, flag the selected options
        if (selectEl.multiple && optPar && optPar.selection && 
            optPar.selection[key]) {
          // flag the option element with this value as selected
          optionEl.selected = true;
        }      
      }
      selectEl.add( optionEl);
    }
  },

  /**
   * Create a choice widget in a given fieldset element.
   * A choice element is either an HTML radio button or an HTML checkbox.
   * @method 
   */
  createChoiceWidget: function(containerEl, fld, values, choiceWidgetType, choiceItems) {
    var j = 0, el = null, choiceControls = containerEl.getElementsByTagName("label");

    // clear old element
    for (j=0; j<choiceControls.length; j++) {
      containerEl.removeChild(choiceControls[i]);
    }

    if (!containerEl.hasAttribute("data-bind")) {
      containerEl.setAttribute("data-bind", fld);
    }

    if (values.length >= 1) {
      if (choiceWidgetType === "radio") { // radio-button
        containerEl.setAttribute("data-value", values[0]);
      } else {// checkboxes
        containerEl.setAttribute("data-value", "["+ values.join() +"]")
      }
    }

    for (j=0; j<choiceItems.length; j++) {
      // button values = 1..n
      el = util.createLabeledChoiceControl(choiceWidgetType, fld, j+1, choiceItems[j]);
      
      // check the radio button or checkbox
      if (values.includes(j+1)) el.firstElementChild.checked = true;
      containerEl.appendChild( el);
      el.firstElementChild.addEventListener("click", function (e) {
        var btnEl = e.target, i=0, values=[];
        if (choiceWidgetType === "radio") {
          if (containerEl.getAttribute("data-value") !== btnEl.value) {
            containerEl.setAttribute("data-value", btnEl.value);
          } else {
            // turn off radio button
            btnEl.checked = false;
            containerEl.setAttribute("data-value", "");
          }
        } else {  // checkbox
          values = JSON.parse( containerEl.getAttribute("data-value")) || [];
          i = values.indexOf( parseInt( btnEl.value));
          if (i > -1) {   
            values.splice(i, 1);  // delete from value list
          } else {  // add to value list 
            values.push( btnEl.value);
          }
          containerEl.setAttribute("data-value", "["+ values.join() +"]");            
        }
      });
    }
    return containerEl
  },
  
  createLabeledChoiceControl: function(t, n, v, lbl) {
    var ccEl = document.createElement("input"),
        lblEl = document.createElement("label");

    ccEl.type = t;
    ccEl.name = n;
    ccEl.value = v;
    lblEl.appendChild(ccEl);
    lblEl.appendChild(document.createTextNode(lbl))
    return lblEl;
  }
}