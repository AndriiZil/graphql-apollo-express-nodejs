const express = require('express');
const cors = require('cors');
const dotEnv = require('dotenv');
const { merge } = require('lodash');
const { ApolloServer, gql } = require('apollo-server-express');

const { taskResolver, userResolver } = require('./resolvers');
const typeDefs = require('./typeDefs');

dotEnv.config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

const apolloServer = new ApolloServer({
    typeDefs,
    resolvers: merge(taskResolver, userResolver)
});

apolloServer.applyMiddleware({ app, path: '/graphql' });

app.listen(PORT, () => {
    console.log(`Server listening on PORT: ${PORT}`);
    console.log(`Graphql Endpoint: ${apolloServer.graphqlPath}`);
});
