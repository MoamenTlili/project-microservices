const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./graphql-schema/schema');
const resolvers = require('./resolver/resolvers');

// Create an Express app
const app = express();

// Create an ApolloServer instance
const server = new ApolloServer({ typeDefs, resolvers });

// Start the Apollo Server
async function startServer() {
  await server.start();

  server.applyMiddleware({ app });

  const PORT = process.env.PORT || 4000;


  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}/graphql`);
  });
}

startServer().catch(error => {
  console.error('Error starting server:', error.message);
});