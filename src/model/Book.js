// Book model class

function Book(slots) {
  this.isbn = slots.isbn;
  this.title = slots.title;
  this.year = slots.year;
}

// class-level property representing the collection of all Book instances managed by app
// Initially collection is empty, (empty object literal)
Book.instances= {};

// Create new Book, Add book to instance of Book.instances
Book.add = function(slots) {
  var book = new Book(slots);

  // isbn is key, book obj is value
  Book.instances[slots.isbn] = book;
  console.log("Book " + slots.isbn + " created");
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
  var book = Book(bookItem);
  return book;
}

// Update book instance
Book.update = function(slots) {
  var book = Book.instances[slots.isbn]; // fetch book via isbn
  var year = parseInt(slots.year);

  // update book items to new records
  if (book.title !== slots.title) { book.title = slots.title; }
  if (book.year !== slots.year) { book.year = slots.year }

  console.log("Book " + slots.isbn + " modified!");
}

// Delete a book
Book.destroy = function(isbn) {
  if (Book.instances[isbn]) {
    console.log("Book " + isbn + " deleted");
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
  
} 