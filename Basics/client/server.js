const { ApolloServer, gql } = require('apollo-server-express');
const express = require('express');

const typeDefs = gql`
  type Query {
    hello: String
  }
`;

const resolvers = {
  Query: {
    hello: () => 'Hello world!',
  },
};

const startServer = async () => {
  const server = new ApolloServer({ typeDefs, resolvers });

  await server.start(); // Ensure the server is started before applying middleware

  const app = express();

  server.applyMiddleware({ app });

  app.listen({ port: 4000 }, () =>
    console.log(`Server ready at http://localhost:4000${server.graphqlPath}`)
  );
};

startServer().catch(err => {
  console.error('Error starting the server', err);
});
