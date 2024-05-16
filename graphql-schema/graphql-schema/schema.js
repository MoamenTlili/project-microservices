const { gql } = require('apollo-server-express');

const typeDefs = `#gql
  type Book {
    id: ID!
    title: String!
    author: String!
    price: Float!
  }

  type User {
    id: ID!
    name: String!
    email: String!
  }

  type Query {
    getBook(id: ID!): Book
    getUser(id: ID!): User
    listBooks: [Book]
  }

  type Mutation {
    createBook(title: String!, author: String!, price: Float!): Book
    createUser(name: String!, email: String!): User
    deleteBook(id: ID!): Boolean
    deleteUser(id: ID!): Boolean
    updateBook(id: ID!, title: String, author: String, price: Float): Book
    updateUser(id: ID!, name: String, email: String): User
  }
`;

module.exports = typeDefs;