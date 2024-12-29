const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const { MongoClient, ObjectId } = require('mongodb');
const path = require('path');

// Load the gRPC proto file
const PROTO_PATH = path.join(__dirname, 'protos', 'books.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const booksProto = grpc.loadPackageDefinition(packageDefinition);

// Connect to MongoDB
const mongoClient = new MongoClient(process.env.MONGO_URL || 'mongodb://localhost:27017/library');

mongoClient.connect().then(async () => {
  const db = mongoClient.db('library');
  const booksCollection = db.collection('books');

  async function createBook(call, callback) {
    const book = call.request;
    console.log('Received request to create book:', book);
    try {
        const result = await booksCollection.insertOne(book);
        console.log('Insertion result:', result);
        if (result && result.ops && result.ops.length > 0) {
            const createdBook = result.ops[0];
            console.log('Created book:', createdBook);
            callback(null, { book: createdBook });
        } else {
            callback({
                code: grpc.status.INTERNAL,
                message: 'Error creating book: Insertion result is empty'
            });
        }
    } catch (error) {
        console.error('Error creating book:', error.message);
        callback({
            code: grpc.status.INTERNAL,
            message: 'Error creating book: ' + error.message
        });
    }
}



  // Implementation of services' logic
  async function getBookById(call, callback) {
    const bookId = call.request.bookId;
    console.log('Book ID:', bookId);
    try {
      const book = await booksCollection.findOne({ _id: new ObjectId(bookId) });
      console.log('Retrieved Book:', book); 
      if (!book) {
        callback({
          code: grpc.status.NOT_FOUND,
          message: 'Book not found'
        });
      } else {
        callback(null, { book });
      }
    } catch (error) {
      callback({
        code: grpc.status.INTERNAL,
        message: 'Error getting book: ' + error.message
      });
    }
  }
  

  async function deleteBook(call, callback) {
    const bookId = call.request.bookId;
    try {
      const result = await booksCollection.deleteOne({ _id: new ObjectId(bookId) });
      if (result.deletedCount === 0) {
        callback({
          code: grpc.status.NOT_FOUND,
          message: 'Book not found'
        });
      } else {
        callback(null, {});
      }
    } catch (error) {
      callback({
        code: grpc.status.INTERNAL,
        message: 'Error deleting book: ' + error.message
      });
    }
  }

  async function updateBook(call, callback) {
    const { bookId, title, author, price } = call.request;
    console.log('Received book ID for update:', bookId);
    try {
      console.log('Updating book with ID:', bookId);
      const result = await booksCollection.updateOne({ _id: new ObjectId(bookId) }, { $set: { title, author, price } });
      console.log('Update result:', result);
      if (result.modifiedCount === 0) {
        callback({
            code: grpc.status.NOT_FOUND,
            message: 'Book not found'
        });
      } else {
        callback(null, {});
      }
    } catch (error) {
      console.error('Error updating book:', error);
      callback({
          code: grpc.status.INTERNAL,
          message: 'Error updating book: ' + error.message
      });
    }
  }
  
  

  async function listBooks(call, callback) {
    try {
      const books = await booksCollection.find({}).toArray();
      callback(null, { books });
    } catch (error) {
      callback({
        code: grpc.status.INTERNAL,
        message: 'Error listing books: ' + error.message
      });
    }
  }

  // Create gRPC server
  const server = new grpc.Server();

  // Add service implementations to the server
  server.addService(booksProto.books.Books.service, {
    createBook,
    getBookById,
    deleteBook,
    updateBook,
    listBooks
  });

  // Start the gRPC server
  server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err) {
      console.error('Error starting gRPC server:', err);
      return;
    }
    console.log('gRPC server started on port', port);
    server.start();
  });

}).catch(error => {
  console.error('Error connecting to MongoDB:', error);
});