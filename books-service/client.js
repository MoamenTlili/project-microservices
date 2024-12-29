const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const { ObjectId } = require('mongodb');

// Load the gRPC proto file
const PROTO_PATH = path.join(__dirname, 'protos', 'books.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const booksProto = grpc.loadPackageDefinition(packageDefinition);

// Create gRPC client
const client = new booksProto.books.Books('localhost:50051', grpc.credentials.createInsecure());

// Function to create a book
function createBook(title, author, price) {
  const book = {
    title: title,
    author: author,
    price: price
  };

  client.createBook(book, (error, response) => {
    if (error) {
      console.error('Error creating book:', error.message);
      // Log additional error details if available
      if (error.details) {
        console.error('Error details:', error.details);
      }
    } else {
      console.log('Response:', response); 
      if (response.book) {
        console.log('Book created successfully:', response.book);
      } else {
        console.error('Book creation failed: Book details not returned');
      }
    }
  });
}

// Extract command-line arguments
const args = process.argv.slice(2);

// Check if the user passed arguments for creating a book
if (args.length === 3) {
    const [title, author, price] = args;
    createBook(title, author, parseFloat(price)); 
} else {
    console.log('Invalid arguments. Usage: node client.js <title> <author> <price>');
}

// Function to delete a book
function deleteBook(bookId) {
    const request = {
      bookId: bookId
    };
  
    client.deleteBook(request, (error, response) => {
      if (error) {
        console.error('Error deleting book:', error.message);
        if (error.details) {
          console.error('Error details:', error.details);
        }
      } else {
        console.log('Response:', response); 
        console.log('Book deleted successfully');
      }
    });
}

// Function to update a book
function updateBook(bookId, updatedTitle, updatedAuthor, updatedPrice) {
    const request = {
      bookId: bookId, 
      title: updatedTitle,
      author: updatedAuthor,
      price: updatedPrice
    };
  
    client.updateBook(request, (error, response) => {
      if (error) {
        console.error('Error updating book:', error.message);
        if (error.details) {
          console.error('Error details:', error.details);
        }
      } else {
        console.log('Response:', response);
        console.log('Book updated successfully');
      }
    });
}

// Function to get a book by id
function getBookById(bookId) {
  const request = {
    bookId: bookId,
  };

  client.getBookById(request, (error, response) => {
    if (error) {
      console.error('Error getting book by ID:', error.message);
      if (error.details) {
        console.error('Error details:', error.details);
      }
    } else {
      console.log('Response:', response);
      if (response.book) {
        console.log('Book retrieved successfully:', response.book);
      } else {
        console.error('Book not found');
      }
    }
  });
}

// Example usage "CREATE":
//createBook('Theexam', 'Joell', 20.99);

//Example usage "DELETE":
//deleteBook('663de94af746d37dcb863eba');

//Example usage "UPDATE":
//updateBook('663de540a12d690bfd12559d', 'No Longer Human', 'Osamu Dazai', 15.99);

// Example usage: Get book by ID
//getBookById('663df007a391cd09d39df63d');