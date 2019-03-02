// Book model class

var LanguageEL = new Enumeration({
  "en":"English",
  "de":"German",
  "fr":"French",
  "es":"Spanish"
});


var BookCategoryEL = new Enumeration([
  "novel",
  "biography",
  "textbook",
  "other"
]);

var PublicationFormEL = new Enumeration([
  "hardcover",
  "paperback",
  "ePub",
  "PDF"
]);

function Book(slots) {
  this.isbn = "";
  this.title = "";
  this.year = 0; // Int value

  this.originalLanguage = 0; // number from languageEl
  this.otherAvailableLanguages = [] // list of numbers from LanguageEl
  this.category = 0; // number from BookCategoryEL
  this.publicationForms = []; // List of no from PublicationFormEl

  if (arguments.length > 0) {
    this.setIsbn(slots.isbn);
    this.setTitle(slots.title);
    this.setYear(slots.year);

    this.setOriginalLanguage(slots.originalLanguage);
    this.setOtherAvailableLanguages(slots.otherAvailableLanguages);
    this.setCategory(slots.category);
    this.setPublicationForms(slots.publicationForms);
    
    if (slots.edition) { // optional field
      this.setEdition(slots.edition);
    }
  }
}

// class-level property representing the collection of all Book instances managed by app
// Initially collection is empty, (empty object literal)
Book.instances= {};

/************* ENUM Get and Setters ********************/
Book.checkOriginalLanguage = function(langValue) {
  if (langValue === undefined) {
    return new MandatoryValueConstraintViolation("An original language must be provided");
  } else if (!Number.isInteger(langValue) || langValue < 1 || langValue > LanguageEL.MAX) {
    return new RangeConstraintViolation("Invalid value for original language" + l);
  } else {
    return new NoConstraintViolation();
  }
}
Book.prototype.setOriginalLanguage = function(languageValue) {
  console.log("lang", languageValue)
  var constraintViolation = Book.checkOriginalLanguage(languageValue);
  if (constraintViolation instanceof NoConstraintViolation) {
    this.originalLanguage = languageValue;
  } else {
    throw constraintViolation;
  }
}

Book.checkOtherAvailablelanguage = function(otherLang) {
  if (!Number.isInteger(otherLang) || otherLang < 1 || otherLang > LanguageEL.MAX) {
    return new RangeConstraintViolation("invalid value for other available language");
  } else {
    return new NoConstraintViolation();
  }
}

Book.checkOtherAvailablelanguages = function(otherLangs) {
  var i=0, constraintViolation = null;
  if (otherLangs == undefined || (Array.isArray(otherLangs) && otherLangs.length === 0)) {
    return new NoConstraintViolation();
  } else if (!Array.isArray(otherLangs)) {
    return new RangeConstraintViolation("The value of other languages must be an array");
  } else {
    for (i=0; i<otherLangs.length; i++) {
      constraintViolation = Book.checkOtherAvailablelanguage(otherLangs[i]);
      if (!(constraintViolation instanceof NoConstraintViolation)) {
        return constraintViolation;
      }
    }
    return new NoConstraintViolation();
  }
}

Book.prototype.setOtherAvailableLanguages = function(otherlangs) {
  var constraintViolation = Book.checkOtherAvailablelanguages(otherlangs);
  if (constraintViolation instanceof NoConstraintViolation) {
    this.otherAvailableLanguages = otherlangs
  } else {
    throw constraintViolation;
  }
}


Book.checkCategory = function(category) {
  if (category === undefined || isNaN(category)) {
    return new MandatoryValueConstraintViolation("A category must be provided");
  } else if (!Number.isInteger(category) || category < 1 || category > BookCategoryEL.MAX) {
    return new RangeConstraintViolation("Invalid value for category");
  } else {
    return new NoConstraintViolation();
  }
}

Book.prototype.setCategory = function(category) {
  var constraintViolation = Book.checkCategory(category);
  if (constraintViolation instanceof NoConstraintViolation) {
    this.category = category;
  } else {
    throw constraintViolation;
  }
}

Book.checkPublicationForm = function(pubForm) {
  if (pubForm == undefined) {
    return new MandatoryValueConstraintViolation("No publication form provided");
  } else if (!Number.isInteger(pubForm) || pubForm < 1 || pubForm > PublicationFormEL.MAX) {
    return new RangeConstraintViolation("Invalid value for publication form" + pubForm);
  } else {
    return new NoConstraintViolation();
  }
}

//Check if all members of a set of values are valid enumeration indexes 
Book.checkPublicationForms = function(pubForms) {
  var i = 0; constraintViolation = null;
  if (pubForms == undefined || (Array.isArray(pubForms) && pubForms.length === 0)) {
    return new MandatoryValueConstraintViolation("No publication form provided");
  } else if (!Array.isArray(pubForms)) {
    return new RangeConstraintViolation("Value of publication forms MUST be an array");
  } else {
    for (i=0; i<pubForms.length; i++) {
      constraintViolation = Book.checkPublicationForm(pubForms[i]);
      if (!(constraintViolation instanceof NoConstraintViolation)) {
        return constraintViolation;
      }
    }
    return new NoConstraintViolation();
  }
}

Book.prototype.setPublicationForms = function(pubForms) { 
  var constraintViolation = Book.checkPublicationForms(pubForms);
  if (constraintViolation instanceof NoConstraintViolation) {
    this.publicationForms = pubForms;
  } else {
    throw constraintViolation;
  }
}

/*********** CHECKS AND SETTERS ********************/
Book.checkIsbn = function(id) {
  if (id === undefined) return new NoConstraintViolation();
  else if (typeof(id) !== "string" || id.trim() === "") {
    return new RangeConstraintViolation("ISBN cannot be empty")
  } else if (!/\b\d{9}(\d|X)\b/.test( id)) {
    return new PatternConstraintViolation("ISBN must be a 10 digit string or a 9-digit string followed by 'X'!")    
  } else {
    return new NoConstraintViolation()
  }
}

Book.checkIsbnAsId = function(id) {
  var constraintViolation = Book.checkIsbn(id);
  if ((ConstraintViolation instanceof NoConstraintViolation)) {
    if (!id) {
      constraintViolation = new MandatoryValueConstraintViolation("A value for the isbn must be provided")
    } else if (Book.instances[id]) {
      constraintViolation = new UniquenessConstraintViolation("There is already a book recorded with this ISBN");
    } else {
      constraintViolation = new NoConstraintViolation();
    }
  }
  return constraintViolation;
}

Book.prototype.setIsbn = function(id) {
  var validationResult = Book.checkIsbnAsId(id);
  if (validationResult instanceof NoConstraintViolation) {
    this.isbn = id;
  } else {
    throw validationResult;
  }
}

Book.checkTitle = function(title) {
  if (title === undefined) {
    return new MandatoryValueConstraintViolation("A title must be provided");
  } else if (!util.isNonEmptyString(title)) {
    return new RangeConstraintViolation("The title must be a non empty string");
  } else {
    return new NoConstraintViolation();
  }
}

Book.prototype.setTitle = function(title) {
  var validationResult = Book.checkTitle(title);
  if (validationResult instanceof NoConstraintViolation) {
    this.title = title;
  } else {
    throw validationResult;
  }
}

Book.checkYear = function(year) {
  var yearOfFirstBook = 1459;
  if (year === undefined) {
    return new MandatoryValueConstraintViolation("A publication year must be provided!");
  } else if (!util.isIntegerOrIntegerString(year)) {
    return new RangeConstraintViolation("The value of year must be an integer!")
  } else {
    if (typeof year === "string") year = parseInt(year);

    if (year < yearOfFirstBook || year > util.nextYear()) {
      return new IntervalConstraintViolation("The value of the year" + " must be between "+ yearOfFirstBook + " and next year!");
    } else {
      return new NoConstraintViolation;
    }
  }
}

Book.prototype.setYear = function(year) {
  var validationResult = Book.checkYear(year);
  if (validationResult instanceof NoConstraintViolation) {
    this.year = parseInt(year)
  } else {
    throw validationResult;
  }
}

Book.checkEdition = function(edition) {
  // Attribute is optional
  if (edition === undefined || edition == "") return new NoConstraintViolation();
  else {
    if (!util.isIntegerOrIntegerString(edition) || parseInt(edition) < 1) {
      return new RangeConstraintViolation("The value of edition must be a positive integer");
    } else {
      return new NoConstraintViolation();
    }
  }
}

Book.prototype.setEdition = function(edition) {
  var validationResult = Book.checkEdition(edition);

  if (validationResult instanceof NoConstraintViolation) {
    if (edition === undefined || edition === "") {
      delete this.edition; // Just unset optional property
    } else {
      this.edition = parseInt(edition);
    }
  } else {
    throw validationResult;
  }
}

Book.prototype.toString = function() {
  return "Book{ ISBN:" + this.isbn + ", title:" + this.title + 
      ", originalLanguage: " + this.originalLanguage +
      ", otherAvailableLanguage: " + this.otherAvailableLanguages.toString() +
      ", category: " + this.category + "publicationForms:" +
      this.publicationForms.toString(), " year:" + this.year +
  "}"; 
}


// Create new Book, Add book to instance of Book.instances
Book.add = function(slots) {
  var book = null;
  try {
    book = new Book(slots);
  } catch (exception) {
    // Violation caused when calling one of the setters during creation of new Book
    console.log( exception.constructor.name + ": "+ exception.message);
    book = null;
  }

  if (book) {
    Book.instances[book.isbn] = book; // isbn is key, book obj is value
    console.log(book.toString() + " created");
  }

  var book = new Book(slots);
}

// Fetch books stored in local storage
Book.retrieveAll = function() {
  var key = "", keys= [], i= 0, bookString="", books={};

  try {
    if (localStorage["books"]) {
      bookString = localStorage["books"]
    }
  } catch (e) {
    alert("Error in reading from Local Storage \n" + e);
  }

  if (bookString) {
    books = JSON.parse(bookString);
    keys = Object.keys(books);
    console.log( keys.length +" books loaded.");

    for (i=0; i < keys.length; i++) {
      key = keys[i];
      Book.instances[key] = Book.convertRecordToObject(books[key]);
    }
  }
}

Book.convertRecordToObject = function(bookItem) {
  var book = {};
  try {
    book = new Book(bookItem);
  } catch (exception) {
    console.log(exception.constructor.name + " While deserializing a book row " + exception.message);
  }

  return book;
}

// Update book instance
Book.update = function(slots) {
  var book = Book.instances[slots.isbn], 
      noConstraintViolation = true,
      updatedProperties = [],
      objectBeforeUpdate = util.cloneObject(book);

  try {
    if (book.title !== slots.title) {
      book.setTitle(slots.title);
      updatedProperties.push(title);
    }

    if (book.year !== parseInt(slots.year)) {
      book.setYear(slots.year);
      updatedProperties.push("year");
    }

    if (book.edition !== parseInt(slots.edition)) {
      book.setEdition(slots.edition);
      updatedProperties.push("edition")
    }

    if (book.originalLanguage !== slots.originalLanguage) {
      book.setOriginalLanguage(slots.originalLanguage);
      updatedProperties.push("originallanguage")
    }

    if (!book.otherAvailableLanguages.isEqualTo(slots.otherAvailableLanguages)) {
      book.setOtherAvailableLanguages(slots.otherAvailableLanguages);
      updatedProperties.push("otherAvailableLanguage");
    }

    if (book.category !== slots.category) {
      book.setCategory = slots.category;
      updatedProperties.push("category");
    }

    if (!book.publicationForms.isEqualTo(slots.publicationForms)) {
      book.setPublicationForms(slots.publicationForms);
      updatedProperties.push("publicationForms");
    }
  } catch (exception) {
    console.log( exception.constructor.name + ": "+ exception.message);
    noConstraintViolation = false;
    // Reset, restore object to its state before updating as update failed
    Book.instances[slots.isbn] = objectBeforeUpdate;
  }

  if (noConstraintViolation) {
    if (updatedProperties.length > 0) {
      console.log("Properties " + updatedProperties.toString() + " modified for book " + slots.isbn)
    } else {
      console.log("No property value changed for book " + slots.isbn + " !");
    }
  }
}

// Delete a book
Book.destroy = function(isbn) {
  if (Book.instances[isbn]) {
    console.log(Book.instances[isbn].toString() + " deleted");
    delete Book.instances[isbn];
  } else {
    console.log("There is no book with ISBN " + isbn + " in the database!");
  }
}

// Saving all book objects from the Book.instances collection in main memory to Local Storage
Book.saveAll = function() {
  var bookString= "", error=false,
      numberofBooks= Object.keys(Book.instances).length;

  try {
    // convert book instance object to string, save to LocalStorage
    bookString = JSON.stringify(Book.instances);
    localStorage["books"] = bookString;
  } catch (e) {
    alert("Error when writing to Local Storage\n" + e);
    error = true;
  }

  if (!error) console.log( numberofBooks + " books saved");
}

// TEST METHODS
Book.createTestData = function () {
  try {

    console.log(LanguageEL.EN)

    Book.instances["006251587X"] = new Book({isbn:"006251587X", title:"Weaving the Web", year: 2000,
        originalLanguage:LanguageEL.EN, otherAvailableLanguages:[LanguageEL.DE,LanguageEL.FR], 
        category:BookCategoryEL.NOVEL, publicationForms:[PublicationFormEL.EPUB,PublicationFormEL.PDF]});
    
    Book.instances["0465026567"] = new Book({isbn:"0465026567", title:"Gödel, Escher, Bach", year:1945,
        originalLanguage:LanguageEL.DE, otherAvailableLanguages:[LanguageEL.FR], 
        category:BookCategoryEL.OTHER, publicationForms:[PublicationFormEL.PDF]});
    
    Book.instances["0465030793"] = new Book({isbn:"0465030793", title:"I Am A Strange Loop", year: 1987,
        originalLanguage:LanguageEL.EN, otherAvailableLanguages:[], 
        category:BookCategoryEL.TEXTBOOK, publicationForms:[PublicationFormEL.EPUB]});
    
        
    console.log(Book.instances)
    Book.saveAll();
  } catch (e) {
    console.log( e.constructor.name + ": " + e.message);
  }
};

Book.clearData = function() {
  if (confirm("Do you really want to delete all book data?")) {
    localStorage["books"] = "{}";
  }
}