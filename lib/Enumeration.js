/**
 * We define a meta-class Enumeration for creating enumerations as instances
 * of this meta-class with the help of statements like
 * GenderEL = new Enumeration(["male", "female", "undetermined"]).
 */

function Enumeration(enumerations) {
  
  var i = 0, lbl="", LBL = "";

  if (Array.isArray(enumerations)) {
    // a simple enum defined by a list of labels
    if (!enumerations.every(function(n) {
      return (typeof(n) === "string");
    })) {
      throw new OtherConstraintViolation(
        "A list of enumeration labels must be an array of strings!"
      );
    }

    this.labels = enumerations;
    this.enumLitNames = this.labels;
    this.codeList = null;
  } else if (typeof(enumerations) === "object" && Object.keys(enumerations).length > 0) {
    // a code list defined by a Map {"en":"English"}
    if (!Object.keys(enumerations).every(function(code) {
      return (typeof(enumerations[code]) === "string");
    })) {
      throw new OtherConstraintViolation(
        "Invalid Enumeration constructor argument: "+ enumArg
      )
    }
    this.codeList = enumerations;
    // use the codes as the names of enumeration literals
    this.enumLitNames = Object.keys(this.codeList);
    this.labels = this.enumLitNames.map(function(c) {
      return enumerations[c] + " (" + c +")";
    })
  } else {
    throw new OtherConstraintViolation(
      "Invalid Enumeration constructor argument: "+ enumerations
    );
  }

  this.MAX = this.enumLitNames.length

  // generate the enumeration literals by capitalizing/normalizing

  // label like "text book" or "text-book" is converted to the enumeration literal name "TEXT_BOOK". 
  for (i=1; i<= this.enumLitNames.length; i++) {
    // replace " " and "-" with "_"
    lbl = this.enumLitNames[i-1].replace(/( |-)/g, "_");

    // convert to array of words, capitalize them, and re-convert
    LBL = lbl.split("_").map(function(lblpart) {
      return lblpart.toUpperCase();
    }).join("_");

    // asign enum index
    this[LBL] = i;
  }
  Object.freeze(this);
}

/**
 ===== ===== Example Usages
 
 var  PublicationFormEL = new Enumeration(["hardcover","paperback","ePub","PDF"])
 var  LanguageEL = new Enumeration({"en":"English", "de":"German",
                  "fr":"French", "es":"Spanish"})
 */

/*
 * Serialize a list of enumeration literals/indexes as a list of 
 * enumeration literal names
 */
Enumeration.prototype.convertEnumIndexes2Names = function(item) {
  var listStr = item.map(function(enumint){
    return this.enumLitNames[enumint-1];
  }, this).join(",");
  return listStr;
} 