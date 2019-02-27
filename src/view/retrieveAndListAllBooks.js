publicLibrary.view.retrieveAndListAllBooks = {

  setupUserInterface: function() {
    var tableBodyElement = document.querySelector("table#books>tbody");
    var keys= [], key="", row= {}, i= 0;

    Book.retrieveAll(); // load all book objects
    keys = Object.keys(Book.instances);

    // for each book, create a table row with cells for the 3 attributes
    for (i = 0; i < keys.length; i++) {
      key = keys[i];
      row = tableBodyElement.insertRow();
      row.insertCell(-1).textContent = Book.instances[key].isbn;
      row.insertCell(-1).textContent = Book.instances[key].title;
      row.insertCell(-1).textContent = Book.instances[key].year;
    }
  }
}