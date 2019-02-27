publicLibrary.view.updateBook = {
    
    setupUserInterface: function() {
        var formElement = document.forms['Book'],
            saveButton = formElement.commit,
            selectBookElement = formElement.selectBook;

        var key ="", keys=[], book=null, optionElement=null;

        Book.retrieveAll()

        // populate selection with all books
        keys = Object.keys(Book.instances)
        for(i=0; i<keys.length; i++) {
            key = keys[i];
            book = Book.instances[key]

            optionElement = document.createElement("option")
            optionElement.text = book.title;
            optionElement.value = book.isbn;
            selectBookElement.add(optionElement, null)
        }

        // when a book is selected, populate the form with the book data
        selectBookElement.addEventListener("change", function() {
            var book = null, key = selectBookElement.value;
            if (key) {
                book = Book.instances[key]
                formElement.isbn.value = book.isbn;
                formElement.title.value = book.title;
                formElement.year.value = book.year;
            } else {
                formElement.reset()
            }
        });

        saveButton.addEventListener("click", publicLibrary.view.updateBook.handleUpdateButtonClickEvent);

        window.addEventListener("beforeunload", function() {
            Book.saveAll()
        })
    },

    handleUpdateButtonClickEvent: function() {
        var formElement = document.forms['Book'];

        var slots = {
            isbn: formElement.isbn.value,
            title: formElement.title.value,
            year: formElement.year.value
        };

        Book.update(slots);
        formElement.reset();
    }
}