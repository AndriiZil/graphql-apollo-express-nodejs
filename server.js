const express = require('express');
const cors = require('cors');
const dotEnv = require('dotenv');
const { merge } = require('lodash');
const { ApolloServer, gql } = require('apollo-server-express');

const { taskResolver, userResolver } = require('./resolvers');
const typeDefs = require('./typeDefs');
const { connection } = require('./database/utils');
const { verifyUser } = require('./helper/context');

dotEnv.config();

connection().catch(console.error);

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers: merge(taskResolver, userResolver),
  context: ({ req }) => {
    verifyUser(req);
    return {
      userId: req.userId
    }
  }

});

apolloServer.applyMiddleware({ app, path: '/graphql' });

app.listen(PORT, () => {
  console.log(`Server listening on PORT: ${PORT}`);
  console.log(`Graphql Endpoint: ${apolloServer.graphqlPath}`);
});
