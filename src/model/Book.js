// Book model class

function Book(slots) {
  this.isbn = "";
  this.title = "";
  this.year = 0; // Int value

  if (arguments.length > 0) {
    this.setIsbn(slots.isbn);
    this.setTitle(slots.title);
    this.setYear(slots.year);

    if (slots.edition) { // optional field
      this.setEdition(slots.edition);
    }
  }
}

// class-level property representing the collection of all Book instances managed by app
// Initially collection is empty, (empty object literal)
Book.instances= {};

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
  return "Book{ ISBN:" + this.isbn + ", title:" + this.title + ", year:" + this.year + "}"; 
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
  var key = "", keys= [], index= 0, bookString="", books={};

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


Book.createTestData = function() {
  try {
    Book.instances["006251587X"] = new Book({isbn:"006251587X", title:"Weaving the Web", year:2000, edition: 2});
    Book.instances["0465026567"] = new Book({isbn:"0465026567", title:"Gödel, Escher, Bach", year:1999});
    Book.instances["0465030793"] = new Book({isbn:"0465030793", title:"I Am A Strange Loop", year:2008});

    Book.saveAll();
  } catch (exception) {
    console.log(exception.constructor.name +": " + exception.message);
  }
}

Book.clearData = function() {
  if (confirm("Do you really want to delete all book data?")) {
    localStorage["books"] = "{}";
  }
}