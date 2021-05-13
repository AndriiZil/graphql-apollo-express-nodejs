const { skip } = require('graphql-resolvers');
const Task = require('../../database/models/Task');
const { isValidObjectId } = require('../../database/utils');

module.exports.isAuthenticated = (_, __, { userId }) => {
  if (!userId) {
    throw new Error('Access Denied! Please login into app.');
  }
  return skip;
}

module.exports.isTaskOwner = async (_, { id }, { userId }) => {
  try {
    if (!isValidObjectId(id)) {
      throw new Error('Task id is invalid.');
    }

    const task = await Task.findById(id);

    if (!task) {
      throw new Error('Tas was not found.');
    } else if (task.user.toString() !== userId) {
      throw new Error('You are not task owner.');
    }

    return skip;
  } catch (err) {
    console.error(err);
    throw err;
  }
}
