publicLibrary.controller.createBook = {

  initialize: function() {
    publicLibrary.controller.createBook.loadData();
    publicLibrary.view.createBook.setupUserInterface();
  },

  loadData: function() {
    Book.retrieveAll();
  }
}