// Global library array to store all books
const myLibrary = [];

// Book constructor function
function Book(title, author, pages, read) {
    this.id = crypto.randomUUID(); // Generate unique ID for each book
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
}

// Prototype method to toggle read status
Book.prototype.toggleReadStatus = function() {
    this.read = !this.read;
};

// Function to add a book to the library array
function addBookToLibrary(title, author, pages, read) {
    const newBook = new Book(title, author, pages, read);
    myLibrary.push(newBook);
    displayBooks(); // Refresh the display
}

// Function to remove a book from the library
function removeBookFromLibrary(bookId) {
    const bookIndex = myLibrary.findIndex(book => book.id === bookId);
    if (bookIndex > -1) {
        myLibrary.splice(bookIndex, 1);
        displayBooks(); // Refresh the display
    }
}

// Function to toggle read status of a book
function toggleBookReadStatus(bookId) {
    const book = myLibrary.find(book => book.id === bookId);
    if (book) {
        book.toggleReadStatus();
        displayBooks(); // Refresh the display
    }
}

// Function to create HTML for a single book card
function createBookCard(book) {
    return `
        <div class="book-card" data-book-id="${book.id}">
            <div class="book-info">
                <h3>${escapeHtml(book.title)}</h3>
                <p class="author">by ${escapeHtml(book.author)}</p>
                ${book.pages ? `<p class="pages">${book.pages} pages</p>` : ''}
                <span class="read-status ${book.read ? 'read' : 'not-read'}">
                    ${book.read ? 'Read' : 'Not Read'}
                </span>
            </div>
            <div class="book-actions">
                <button class="btn-small btn-toggle" onclick="toggleBookReadStatus('${book.id}')">
                    ${book.read ? 'Mark as Unread' : 'Mark as Read'}
                </button>
                <button class="btn-small btn-remove" onclick="removeBookFromLibrary('${book.id}')">
                    Remove Book
                </button>
            </div>
        </div>
    `;
}

// Function to display all books in the library
function displayBooks() {
    const libraryGrid = document.getElementById('libraryGrid');
    const emptyState = document.getElementById('emptyState');
    
    // Clear current display
    libraryGrid.innerHTML = '';
    
    if (myLibrary.length === 0) {
        // Show empty state message
        emptyState.style.display = 'block';
        libraryGrid.style.display = 'none';
    } else {
        // Hide empty state and show books
        emptyState.style.display = 'none';
        libraryGrid.style.display = 'grid';
        
        // Create and append book cards
        myLibrary.forEach(book => {
            libraryGrid.innerHTML += createBookCard(book);
        });
    }
}

// Utility function to escape HTML to prevent XSS attacks
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Function to reset and close the form
function resetForm() {
    const form = document.getElementById('bookForm');
    const dialog = document.getElementById('bookDialog');
    
    form.reset(); // Clear all form fields
    dialog.close(); // Close the modal
}

// Event listener for form submission
function handleFormSubmit(event) {
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
    addBookToLibrary(title, author, pages, read);
    
    // Reset and close form
    resetForm();
}

// DOM Content Loaded Event Listener
document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const newBookBtn = document.getElementById('newBookBtn');
    const bookDialog = document.getElementById('bookDialog');
    const bookForm = document.getElementById('bookForm');
    const cancelBtn = document.getElementById('cancelBtn');
    
    // Event Listeners
    newBookBtn.addEventListener('click', () => {
        bookDialog.showModal(); // Open the modal dialog
    });
    
    cancelBtn.addEventListener('click', resetForm);
    
    bookForm.addEventListener('submit', handleFormSubmit);
    
    // Close dialog when clicking outside of it
    bookDialog.addEventListener('click', (event) => {
        if (event.target === bookDialog) {
            resetForm();
        }
    });
    
    // Initial display
    displayBooks();
    

});

