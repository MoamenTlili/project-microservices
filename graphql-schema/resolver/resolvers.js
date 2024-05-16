const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

// Load the gRPC proto files for books and users
const bookProtoPath = '../books-service/protos/books.proto';
const userProtoPath = '../users-service/protos/users.proto';

const bookProtoDefinition = protoLoader.loadSync(bookProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const userProtoDefinition = protoLoader.loadSync(userProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const booksProto = grpc.loadPackageDefinition(bookProtoDefinition).books;
const usersProto = grpc.loadPackageDefinition(userProtoDefinition).users;

// Define resolvers for GraphQL queries and mutations
const resolvers = {
  Query: {
    getBook: async (_, { id }) => {
      const client = new booksProto.Books('localhost:50051', grpc.credentials.createInsecure());
      return new Promise((resolve, reject) => {
        client.getBookById({ bookId: id }, (err, response) => {
          if (err) {
            reject(err);
          } else {
            resolve(response.book);
          }
        });
      });
    },
    getUser: async (_, { id }) => {
      const client = new usersProto.Users('localhost:50052', grpc.credentials.createInsecure());
      return new Promise((resolve, reject) => {
        client.getUser({ userId: id }, (err, response) => {
          if (err) {
            reject(err);
          } else {
            resolve(response.user);
          }
        });
      });
    },
    listBooks: async () => {
      const client = new booksProto.Books('localhost:50051', grpc.credentials.createInsecure());
      return new Promise((resolve, reject) => {
        client.listBooks({}, (err, response) => {
          if (err) {
            reject(err);
          } else {
            resolve(response.books);
          }
        });
      });
    },
  },
  Mutation: {
    createBook: async (_, args) => {
      const client = new booksProto.Books('localhost:50051', grpc.credentials.createInsecure());
      return new Promise((resolve, reject) => {
        client.createBook(args, (err, response) => {
          if (err) {
            reject(err);
          } else {
            resolve(response.book);
          }
        });
      });
    },
    createUser: async (_, args) => {
      const client = new usersProto.Users('localhost:50052', grpc.credentials.createInsecure());
      return new Promise((resolve, reject) => {
        client.createUser(args, (err, response) => {
          if (err) {
            reject(err);
          } else {
            resolve(response.user);
          }
        });
      });
    },
    deleteBook: async (_, { id }) => {
      const client = new booksProto.Books('localhost:50051', grpc.credentials.createInsecure());
      return new Promise((resolve, reject) => {
        client.deleteBook({ bookId: id }, (err, response) => {
          if (err) {
            reject(err);
          } else {
            resolve(response);
          }
        });
      });
    },
    deleteUser: async (_, { id }) => {
      const client = new usersProto.Users('localhost:50052', grpc.credentials.createInsecure());
      return new Promise((resolve, reject) => {
        client.deleteUser({ userId: id }, (err, response) => {
          if (err) {
            reject(err);
          } else {
            resolve(response);
          }
        });
      });
    },
    updateBook: async (_, args) => {
      const client = new booksProto.Books('localhost:50051', grpc.credentials.createInsecure());
      return new Promise((resolve, reject) => {
        client.updateBook(args, (err, response) => {
          if (err) {
            reject(err);
          } else {
            resolve(response.book);
          }
        });
      });
    },
    updateUser: async (_, args) => {
      const client = new usersProto.Users('localhost:50052', grpc.credentials.createInsecure());
      return new Promise((resolve, reject) => {
        client.updateUser(args, (err, response) => {
          if (err) {
            reject(err);
          } else {
            resolve(response.user);
          }
        });
      });
    },
  },
};

module.exports = resolvers;
