function getBooksFromStorage() {
  return JSON.parse(localStorage.getItem("bookshelfApp")) || [];
}

function saveBooksToStorage(books) {
  localStorage.setItem("bookshelfApp", JSON.stringify(books));
}

function renderBooks() {
  const books = getBooksFromStorage();
  const incompleteBookList = document.getElementById("incompleteBookList");
  const completeBookList = document.getElementById("completeBookList");

  incompleteBookList.innerHTML = "";
  completeBookList.innerHTML = "";

  books.forEach((book) => {
    const bookElement = createBookElement(book);

    if (book.isComplete) {
      completeBookList.append(bookElement);
    } else {
      incompleteBookList.append(bookElement);
    }
  });
}

function createBookElement(book) {
  const bookItem = document.createElement("div");
  bookItem.classList.add("book-item");
  bookItem.dataset.bookid = book.id;
  bookItem.setAttribute("data-testid", "bookItem");

  bookItem.innerHTML = `
    <h3 class="book-item__title" data-testid="bookItemTitle">${book.title}</h3>
    <p class="book-item__author" data-testid="bookItemAuthor">Penulis: ${
      book.author
    }</p>
    <p class="book-item__year" data-testid="bookItemYear">Tahun: ${
      book.year
    }</p>
    <div class="book-item__buttons">
      <button class="book-item__button book-item__button--complete" data-testid="bookItemIsCompleteButton">
        ${book.isComplete ? "Belum selesai dibaca" : "Selesai dibaca"}
      </button>
      <button class="book-item__button book-item__button--delete" data-testid="bookItemDeleteButton">Hapus Buku</button>
      <button class="book-item__button book-item__button--edit" data-testid="bookItemEditButton">Edit Buku</button>
    </div>
  `;

  bookItem
    .querySelector(".book-item__button--complete")
    .addEventListener("click", () => toggleBookCompletion(book.id));
  bookItem
    .querySelector(".book-item__button--delete")
    .addEventListener("click", () => deleteBook(book.id));
  bookItem
    .querySelector(".book-item__button--edit")
    .addEventListener("click", () => editBook(book));

  return bookItem;
}

const bookForm = document.getElementById("bookForm");
bookForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const title = document.getElementById("bookFormTitle").value;
  const author = document.getElementById("bookFormAuthor").value;
  const year = Number(document.getElementById("bookFormYear").value);
  const isComplete = document.getElementById("bookFormIsComplete").checked;

  const newBook = {
    id: new Date().getTime(),
    title,
    author,
    year,
    isComplete,
  };

  const books = getBooksFromStorage();
  books.push(newBook);
  saveBooksToStorage(books);

  renderBooks();
  bookForm.reset();
});

function toggleBookCompletion(id) {
  const books = getBooksFromStorage();
  const bookIndex = books.findIndex((book) => book.id === id);
  books[bookIndex].isComplete = !books[bookIndex].isComplete;
  saveBooksToStorage(books);
  renderBooks();
}

function deleteBook(id) {
  let books = getBooksFromStorage();
  books = books.filter((book) => book.id !== id);
  saveBooksToStorage(books);
  renderBooks();
}

function editBook(book) {
  document.getElementById("bookFormTitle").value = book.title;
  document.getElementById("bookFormAuthor").value = book.author;
  document.getElementById("bookFormYear").value = book.year;
  document.getElementById("bookFormIsComplete").checked = book.isComplete;

  const submitButton = document.getElementById("bookFormSubmit");
  submitButton.innerText = "Update Buku";

  const updateBook = function () {
    const books = getBooksFromStorage();
    const bookIndex = books.findIndex((b) => b.id === book.id);

    books[bookIndex] = {
      ...book,
      title: document.getElementById("bookFormTitle").value,
      author: document.getElementById("bookFormAuthor").value,
      year: Number(document.getElementById("bookFormYear").value),
      isComplete: document.getElementById("bookFormIsComplete").checked,
    };

    saveBooksToStorage(books);
    renderBooks();

    bookForm.reset();
    submitButton.innerText = "Masukkan Buku ke rak";
    submitButton.removeEventListener("click", updateBook);
  };

  submitButton.addEventListener("click", updateBook);
}

const searchForm = document.getElementById("searchBook");
searchForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const searchTitle = document
    .getElementById("searchBookTitle")
    .value.toLowerCase();
  const books = getBooksFromStorage();
  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchTitle)
  );
  renderFilteredBooks(filteredBooks);
});

function renderFilteredBooks(books) {
  const incompleteBookList = document.getElementById("incompleteBookList");
  const completeBookList = document.getElementById("completeBookList");

  incompleteBookList.innerHTML = "";
  completeBookList.innerHTML = "";

  books.forEach((book) => {
    const bookElement = createBookElement(book);

    if (book.isComplete) {
      completeBookList.append(bookElement);
    } else {
      incompleteBookList.append(bookElement);
    }
  });
}

window.addEventListener("load", () => {
  renderBooks();
});
