// Book class definition
class Book {
    constructor(title, author, pages, read) {
        this.id = crypto.randomUUID(); // Generate unique ID for each book
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.read = read;
    }

    // Method to toggle read status
    toggleReadStatus() {
        this.read = !this.read;
    }
}

// Library class to manage the collection of books
class Library {
    constructor() {
        this.books = [];
    }

    // Method to add a book to the library
    addBook(title, author, pages, read) {
        const newBook = new Book(title, author, pages, read);
        this.books.push(newBook);
        this.displayBooks(); // Refresh the display
    }

    // Method to remove a book from the library
    removeBook(bookId) {
        const bookIndex = this.books.findIndex(book => book.id === bookId);
        if (bookIndex > -1) {
            this.books.splice(bookIndex, 1);
            this.displayBooks(); // Refresh the display
        }
    }

    // Method to toggle read status of a book
    toggleBookReadStatus(bookId) {
        const book = this.books.find(book => book.id === bookId);
        if (book) {
            book.toggleReadStatus();
            this.displayBooks(); // Refresh the display
        }
    }

    // Method to create HTML for a single book card
    createBookCard(book) {
        return `
            <div class="book-card" data-book-id="${book.id}">
                <div class="book-info">
                    <h3>${this.escapeHtml(book.title)}</h3>
                    <p class="author">by ${this.escapeHtml(book.author)}</p>
                    ${book.pages ? `<p class="pages">${book.pages} pages</p>` : ''}
                    <span class="read-status ${book.read ? 'read' : 'not-read'}">
                        ${book.read ? 'Read' : 'Not Read'}
                    </span>
                </div>
                <div class="book-actions">
                    <button class="btn-small btn-toggle" onclick="myLibrary.toggleBookReadStatus('${book.id}')">
                        ${book.read ? 'Mark as Unread' : 'Mark as Read'}
                    </button>
                    <button class="btn-small btn-remove" onclick="myLibrary.removeBook('${book.id}')">
                        Remove Book
                    </button>
                </div>
            </div>
        `;
    }

    // Method to display all books in the library
    displayBooks() {
        const libraryGrid = document.getElementById('libraryGrid');
        const emptyState = document.getElementById('emptyState');
        
        // Clear current display
        libraryGrid.innerHTML = '';
        
        if (this.books.length === 0) {
            // Show empty state message
            emptyState.style.display = 'block';
            libraryGrid.style.display = 'none';
        } else {
            // Hide empty state and show books
            emptyState.style.display = 'none';
            libraryGrid.style.display = 'grid';
            
            // Create and append book cards
            this.books.forEach(book => {
                libraryGrid.innerHTML += this.createBookCard(book);
            });
        }
    }

    // Utility method to escape HTML to prevent XSS attacks
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Create a global library instance
const myLibrary = new Library();

// UI Controller class to handle form interactions
class UIController {
    constructor(library) {
        this.library = library;
        this.initializeEventListeners();
    }

    // Initialize all event listeners
    initializeEventListeners() {
        document.addEventListener('DOMContentLoaded', () => {
            // Get DOM elements
            const newBookBtn = document.getElementById('newBookBtn');
            const bookDialog = document.getElementById('bookDialog');
            const bookForm = document.getElementById('bookForm');
            const cancelBtn = document.getElementById('cancelBtn');
            
            // Event Listeners
            newBookBtn.addEventListener('click', () => {
                bookDialog.showModal(); // Open the modal dialog
            });
            
            cancelBtn.addEventListener('click', () => this.resetForm());
            
            bookForm.addEventListener('submit', (event) => this.handleFormSubmit(event));
            
            // Close dialog when clicking outside of it
            bookDialog.addEventListener('click', (event) => {
                if (event.target === bookDialog) {
                    this.resetForm();
                }
            });
            
            // Initial display
            this.library.displayBooks();
        });
    }

    // Method to reset and close the form
    resetForm() {
        const form = document.getElementById('bookForm');
        const dialog = document.getElementById('bookDialog');
        
        form.reset(); // Clear all form fields
        dialog.close(); // Close the modal
    }

    // Method to handle form submission
    handleFormSubmit(event) {
        event.preventDefault(); // Prevent default form submission
        
        // Get form data
        const formData = new FormData(event.target);
        const title = formData.get('title').trim();
        const author = formData.get('author').trim();
        const pages = formData.get('pages') ? parseInt(formData.get('pages')) : null;
        const read = formData.has('read'); // checkbox returns true if checked
        
        // Validate required fields
        if (!title || !author) {
            alert('Please fill in both title and author fields.');
            return;
        }
        
        // Add book to library
        this.library.addBook(title, author, pages, read);
        
        // Reset and close form
        this.resetForm();
    }
}

// Initialize the UI controller with the library instance
const uiController = new UIController(myLibrary);