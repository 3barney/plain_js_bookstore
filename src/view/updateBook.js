publicLibrary.view.updateBook = {
    
    setupUserInterface: function() {
        var formElement = document.forms['Book'],
            saveButton = formElement.commit,
            selectBookElement = formElement.selectBook;

        // var key ="", keys=[], book=null, optionElement=null;

        Book.retrieveAll()

        util.fillSelectWithOptions(Book.instances, selectBookElement, "isbn", "title");

        selectBookElement.addEventListener("change", function() {
            var book = null, bookKey = selectBookElement.value;
            if (bookKey) {
                book = Book.instances[bookKey];

                ["isbn", "title", "year", "edition"].forEach(function(item){
                    formElement[item].value = book[item] !== undefined ? book[item] : "";
                    // clear custom validation err message which may have not been set b4
                    formElement[item].setCustomValidity("");
                });
            } else {
                formElement.reset()
            }
        })

        formElement.title.addEventListener("input", function() {
            formElement.title.setCustomValidity(Book.checkTitle(formElement.title.value).message)
        });
        formElement.year.addEventListener("input", function() {
            formElement.year.setCustomValidity(Book.checkYear(formElement.year.value).message);
        });
        formElement.edition.addEventListener("input", function() {
            var v = formElement.edition.value, ed = v ? parseInt(v) : undefined
            formElement.edition.setCustomValidity(Book.checkEdition(ed).message);
        });
        /** 
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
        }); **/

        saveButton.addEventListener("click", publicLibrary.view.updateBook.handleUpdateButtonClickEvent);
        
        formElement.addEventListener("submit", function(event) {
            event.preventDefault()
            formElement.reset()
        })

        window.addEventListener("beforeunload", function() {
            Book.saveAll()
        })
    },

    handleUpdateButtonClickEvent: function() {
        var formElement = document.forms['Book'],
            selectBookElement = formElement.selectBook; 

        var slots = {
            isbn: formElement.isbn.value,
            title: formElement.title.value,
            year: formElement.year.value,
            edition: formElement.edition.value
        };

        formElement.title.setCustomValidity(Book.checkTitle(slots.title).message);
        formElement.year.setCustomValidity(Book.checkYear(slots.year).message);
        formElement.edition.setCustomValidity(Book.checkEdition(slots.edition).message);

        if (formElement.checkValidity()) {
            Book.update(slots);

            // update the selection list option
            selectBookElement.options[selectBookElement.selectedIndex].text = slots.title;
        }

        
        formElement.reset();
    }
}