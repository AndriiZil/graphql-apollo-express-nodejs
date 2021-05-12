const express = require('express');
const cors = require('cors');
const dotEnv = require('dotenv');
const { ApolloServer, gql } = require('apollo-server-express');

const { tasks, users } = require('./constans');

dotEnv.config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

const typeDefs = gql(`
    type Query {
        greetings: [String!]
        tasks: [Task!]
    }
    
    type User {
        id: ID!
        name: String!
        email: String!
        tasks: [Task!]
    }
    
    type Task {
        id: ID!
        name: String!
        completed: Boolean!
        user: User!
    }
`);

const resolvers = {
    Query: {
        greetings: () => ['Hello Andrii', 'adress'],
        tasks: () => tasks
    },
    Task: {
        user: ({ userId }) => users.find(user => user.id === userId) // Field Level Resolver
    }
};

const apolloServer = new ApolloServer({ typeDefs, resolvers });

apolloServer.applyMiddleware({ app, path: '/graphql' });

app.listen(PORT, () => {
    console.log(`Server listening on PORT: ${PORT}`);
    console.log(`Graphql Endpoint: ${apolloServer.graphqlPath}`);
});
