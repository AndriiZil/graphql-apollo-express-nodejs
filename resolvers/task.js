const Task = require('../database/models/Task');
const User = require('../database/models/User');
const { isAuthenticated, isTaskOwner } = require('./middleware');
const { combineResolvers } = require('graphql-resolvers');

module.exports = {
  Query: {
    tasks: combineResolvers(isAuthenticated, async (_, __, { userId }) => {
      try {
        return Task.find({ user: userId });
      } catch (err) {
        console.error(err);
        throw err;
      }
    }),
    task: combineResolvers(isAuthenticated, isTaskOwner, async (_, { id }) => {
      try {
        return Task.findById(id);
      } catch (err) {
        console.error(err);
        throw err;
      }
    })
  },
  Mutation: {
    createTask: combineResolvers(isAuthenticated, async (_, { input }, { userId }) => {
      try {
        const user = await User.findById(userId);
        const task = new Task({ ...input, user: userId });

        const result = await task.save();
        user.tasks.push(result.id);
        await user.save();

        return result;
      } catch (err) {
        console.error(err);
        throw err;
      }
    }),
    updateTask: combineResolvers(isAuthenticated, isTaskOwner, async (_, { id, input }, { userId }) => {
      try {
        const task = await Task.findByIdAndUpdate(id, {
          ...input
        }, { new: true });

        return task;
      } catch (err) {
        console.error(err);
        throw err;
      }
    }),
    deleteTask: combineResolvers(isAuthenticated, isTaskOwner, async (_, { id }, { userId }) => {
      try {
        const task = await Task.findByIdAndDelete(id);
        await User.updateOne({ _id: userId }, { $pull: { tasks: task.id }})
        return task;
      } catch (err) {
        console.error(err);
        throw err;
      }
    })
  },
  Task: {
    user: async (parent) => {
      try {
        return User.findById(parent.user);
      } catch (err) {
        console.error(err);
      }
    }
  }
}
