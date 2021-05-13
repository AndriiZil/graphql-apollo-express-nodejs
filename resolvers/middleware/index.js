const { skip } = require('graphql-resolvers');

module.exports.isAuthenticated = (_, __, { userId }) => {
  if (!userId) {
    throw new Error('Access Denied! Please login into app.');
  }
  return skip;
}