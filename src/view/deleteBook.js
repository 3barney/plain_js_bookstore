publicLibrary.view.deleteBook = {

  setupUserInterface: function() {
    var formElement = document.forms['Book'],
        deleteButton = formElement.commit,
        selectElement = formElement.selectBook;

    var key= "", keys=[], book=null, optionElement=null;

    Book.retrieveAll(); // Get all books
    keys = Object.keys(Book.instances);

    // Populate selection list
    for (i = 0; i < keys.length; i++) {
      key = keys[i];
      book = Book.instances[key]

      optionElement = document.createElement("option")
      optionElement.text = book.title;
      optionElement.value = book.isbn;
      selectElement.add(optionElement, null);
    }

    deleteButton.addEventListener("click",
      publicLibrary.view.deleteBook.handleDeleteButtonClickEvent
    );

    window.addEventListener("beforeunload", function() {
      Book.saveAll()
    })
  },

  handleDeleteButtonClickEvent: function() {
    var selectElement = document.forms['Book'].selectBook;
    var isbn = selectElement.value;

    if (isbn) {
      Book.destroy(isbn);
      selectElement.remove(selectElement.selectedIndex);
    }
  }
}