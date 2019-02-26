publicLibrary.view.createBook = {
  /**
   * retrieving the collection of all objects from the persistent
   * data store and setting up an event handler on the save button for handling click button
   * events by saving the user input data;
   */
  setupUserInterface: function() {
    var saveButton = document.forms['Book'].commit;
    Book.retrieveAll(); // load all book objects

    saveButton.addEventListener("click", 
      publicLibrary.view.createBook.handleSaveButtonClickEvent
    );

    // handle event when browser window/tab is closed
    window.addEventListener("beforeunload", function() {
      Book.saveAll();
    });
  },

  handleSaveButtonClickEvent: function() {
    var formElement = document.forms['Book'];
    var slots = {
      isbn: formElement.isbn.value,
      title: formElement.title.value,
      year: formElement.year.value
    };

    Book.add(slots);
    formElement.reset();
  }
}