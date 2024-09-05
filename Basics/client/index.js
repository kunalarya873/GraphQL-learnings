const express = require("express");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const bodyParser = require('body-parser');
const cors = require('cors');
const gql = require('graphql-tag'); // Import gql from graphql-tag
const axios = require("axios");

// Define your schema and resolvers
const typeDefs = gql`
  type User{
    id: ID!
    name: String!
    username: String!
    phone: String!
    email: String!
    website: String!
  }
  type Todo {
    id: ID!
    title: String!
    completed: Boolean
  }

  type Query {
    todos: [Todo]
    users: [User]
  }
`;

const resolvers = {
  Query: {
    users: async () => {
      try {
        const response = await axios.get("https://jsonplaceholder.typicode.com/users");

        return response.data; // Return the data fetched from the API
      } catch (error) {
        console.error("Error fetching users:", error);
        return []; // Return an empty array in case of error
      }
    },
    todos: async () => {
        try {
          const response = await axios.get("https://jsonplaceholder.typicode.com/todos");
          
          return response.data; // Return the data fetched from the API
        } catch (error) {
          console.error("Error fetching Todos:", error);
          return []; // Return an empty array in case of error
        }
      },
      getSingleUser: async (parent, { id }) => {
        try {
          const response = await axios.get(`https://jsonplaceholder.typicode.com/users/${id}`);
          return response.data; // Return the data fetched from the API
        } catch (error) {
          console.error("Error fetching user:", error);
          return []; // Return an empty array in case of error
        }
      },
  },
};

async function startServer() {
  const app = express();

  // Create an instance of ApolloServer
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  // Middleware setup
  app.use(bodyParser.json());
  app.use(cors());

  // Start the Apollo Server
  await server.start();

  // Apply the Apollo GraphQL middleware
  app.use('/graphql', expressMiddleware(server));

  // Start the Express server
  app.listen(8000, () => {
    console.log("Server started on port 8000");
  });
}

startServer().catch(err => {
  console.error('Error starting the server:', err);
});
