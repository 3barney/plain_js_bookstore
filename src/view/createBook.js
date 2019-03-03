publicLibrary.view.createBook = {
  /**
   * retrieving the collection of all objects from the persistent
   * data store and setting up an event handler on the save button for handling click button
   * events by saving the user input data;
   */
  setupUserInterface: function() {
    Book.retrieveAll(); // load all book objects

    var formElement = document.forms['Book'];
    var saveButton = formElement.commit;
    var origLangSelEl = formElement.originalLanguage,
        otherAvailLangSelEl = formElement.otherAvailableLanguage,
        categoryFieldsetEl = formElement.querySelector(
            "fieldset[data-bind='category']"),
        pubFormsFieldsetEl = formElement.querySelector(
            "fieldset[data-bind='publicationForms']");
    
    // set up the originalLanguage selection list
    util.fillSelectWithOptions(origLangSelEl, LanguageEL.labels);
    // set up the otherAvailableLanguages selection list
    util.fillSelectWithOptions(otherAvailLangSelEl, LanguageEL.labels);

    // set up the category radio button group
    util.createChoiceWidget( categoryFieldsetEl, "category", [], 
        "radio", BookCategoryEL.labels);
    // set up the publicationForms checkbox group
    util.createChoiceWidget( pubFormsFieldsetEl, "publicationForms", [], 
        "checkbox", PublicationFormEL.labels);
    // add event listeners for responsive validation

    // simplified validation: check only mandatory value
    origLangSelEl.addEventListener("change", function () {
      origLangSelEl.setCustomValidity( 
          (!origLangSelEl.value) ? "A value must be selected!":"" );
    });

    // mandatory value check
    categoryFieldsetEl.addEventListener("click", function () {
      formElement.category[0].setCustomValidity( 
          (!categoryFieldsetEl.getAttribute("data-value")) ? 
              "A category must be selected!":"" );
    });
    // mandatory value check
    pubFormsFieldsetEl.addEventListener("click", function () {
      var val = pubFormsFieldsetEl.getAttribute("data-value");
      formElement.publicationForms[0].setCustomValidity( 
          (!val || Array.isArray(val) && val.length === 0) ? 
              "At least one publication form must be selected!":"" );
    });
  
    formElement.isbn.addEventListener("input", function() {
      formElement.isbn.setCustomValidity(
        Book.checkIsbnAsId(formElement.isbn.value).message
      )
    })

    formElement.title.addEventListener("input", function() {
      formElement.title.setCustomValidity(Book.checkTitle(formElement.title.value).message);
    });

    formElement.year.addEventListener("input", function() {
      formElement.year.setCustomValidity(Book.checkYear(formElement.year.value).message);
    });

    formElement.edition.addEventListener("input", function() {
      formElement.edition.setCustomValidity(Book.checkEdition(formElement.edition.value).message);
    });

    saveButton.addEventListener("click", 
      publicLibrary.view.createBook.handleSaveButtonClickEvent
    );
    
    // neutralize submit reset
    formElement.addEventListener("submit", function(event) {
      event.preventDefault();
      formElement.reset();
    });

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
      year: formElement.year.value,
    };

    // Set erro msg incase of violations
    formElement.isbn.setCustomValidity(Book.checkIsbnAsId(slots.isbn).message);
    formElement.title.setCustomValidity(Book.checkTitle(slots.title).message);
    formElement.year.setCustomValidity(Book.checkYear(slots.year).message);
    
    if (formElement.edition.value) {
      slots.edition = formElement.edition.value;
      formElement.edition.setCustomValidity(Book.checkEdition(slots.edition).message);
    }
    
    formElement.edition.setCustomValidity(
      Book.checkEdition(formElement.edition.value).message
    );
    
    // save data if all form fields are valid
    if (formElement.checkValidity()) {
      Book.add(slots);
    }
  }
}