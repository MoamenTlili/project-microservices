const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const axios = require('axios');


const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

//GraphQL schema
const schema = buildSchema(`
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
`);

//resolvers
const root = {
  getBook: async ({ id }) => {
    try {
      const response = await axios.get(`http://localhost:50051/book/${id}`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch book');
    }
  },
  getUser: async ({ id }) => {
    try {
      const response = await axios.get(`http://localhost:50052/user/${id}`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch user');
    }
  },
  listBooks: async () => {
    try {
      const response = await axios.get('http://localhost:50051/books');
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch books');
    }
  },
  createBook: async ({ title, author, price }) => {
    try {
      const response = await axios.post('http://localhost:50051/book', { title, author, price });
      return response.data;
    } catch (error) {
      throw new Error('Failed to create book');
    }
  },
  createUser: async ({ name, email }) => {
    try {
      const response = await axios.post('http://localhost:50052/user', { name, email });
      return response.data;
    } catch (error) {
      throw new Error('Failed to create user');
    }
  },
  deleteBook: async ({ id }) => {
    try {
      const response = await axios.delete(`http://localhost:50051/book/${id}`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to delete book');
    }
  },
  deleteUser: async ({ id }) => {
    try {
      const response = await axios.delete(`http://localhost:50052/user/${id}`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to delete user');
    }
  },
  updateBook: async ({ id, title, author, price }) => {
    try {
      const response = await axios.put(`http://localhost:50051/book/${id}`, { title, author, price });
      return response.data;
    } catch (error) {
      throw new Error('Failed to update book');
    }
  },
  updateUser: async ({ id, name, email }) => {
    try {
      const response = await axios.put(`http://localhost:50052/user/${id}`, { name, email });
      return response.data;
    } catch (error) {
      throw new Error('Failed to update user');
    }
  },

// Logic for REST
createBookRest: async ({ title, author, price }) => {
    try {
      const response = await axios.post('http://localhost:50051/book', { title, author, price });
      return response.data;
    } catch (error) {
      throw new Error('Failed to create book via REST');
    }
  },
  
  getBookRest: async ({ id }) => {
    try {
      const response = await axios.get(`http://localhost:50051/book/${id}`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch book via REST');
    }
  },
  deleteBookRest: async ({ id }) => {
    try {
      const response = await axios.delete(`http://localhost:50051/book/${id}`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to delete book via REST');
    }
  },
  updateBookRest: async ({ id, ...args }) => {
    try {
      const response = await axios.put(`http://localhost:50051/book/${id}`, args);
      return response.data;
    } catch (error) {
      throw new Error('Failed to update book via REST');
    }
  },
};

// GraphQL endpoint
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true 
}));

// REST endpoints
app.post('/book', async (req, res) => {
  try {
    console.log('Request body:', req.body);
    const response = await root.createBookRest(req.body);
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/book/:id', async (req, res) => {
  try {
    const response = await root.getBookRest(req.params);
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/book/:id', async (req, res) => {
  try {
    const response = await root.deleteBookRest(req.params);
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/book/:id', async (req, res) => {
  try {
    const response = await root.updateBookRest({ id: req.params.id, ...req.body });
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



app.listen(PORT, () => {
  console.log(`API Gateway running at http://localhost:${PORT}/graphql`);
});