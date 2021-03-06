const express = require('express');
const cors = require('cors');
const dotEnv = require('dotenv');
const { merge } = require('lodash');
const DataLoader = require('dataloader');
const { ApolloServer, gql } = require('apollo-server-express');

const { taskResolver, userResolver } = require('./resolvers');
const typeDefs = require('./typeDefs');
const { connection } = require('./database/utils');
const { verifyUser } = require('./helper/context');
const loaders = require('./loaders');

dotEnv.config();

connection().catch(console.error);

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

const userLoader = new DataLoader(keys => loaders.user.batchUsers(keys));

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers: merge(taskResolver, userResolver),
  context: async ({ req, connection }) => {
    const contextObj = {};
    if (req) {
      await verifyUser(req);
      contextObj.userId = req.userId
    }

    contextObj.loaders = { user: userLoader };
    return contextObj;
  },
  formatError: (error) => {
    return {
      message: error.message
    }
  }

});

apolloServer.applyMiddleware({ app, path: '/graphql' });

const httpServer = app.listen(PORT, () => {
  console.log(`Server listening on PORT: ${PORT}`);
  console.log(`Graphql Endpoint: ${apolloServer.graphqlPath}`);
});

apolloServer.installSubscriptionHandlers(httpServer);
