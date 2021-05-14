const Task = require('../database/models/Task');
const User = require('../database/models/User');
const { isAuthenticated, isTaskOwner } = require('./middleware');
const { combineResolvers } = require('graphql-resolvers');
const { stringToBase64, base64ToString } = require('../helper');

module.exports = {
  Query: {
    tasks: combineResolvers(isAuthenticated, async (_, { cursor, limit = 10, sort = 1 }, { userId }) => {
      try {
        const query = { user: userId };
        if (cursor) {
          query['_id'] = {
            '$lt': base64ToString(cursor)
          }
        }

        let tasks = await Task.find(query).sort({ _id: sort }).limit(limit + 1);
        const hasNextPage = tasks.length > limit;
        tasks = hasNextPage ? tasks.slice(0, -1) : tasks;

        return {
          taskFeed: tasks,
          pageInfo: {
            nextPageCursor: hasNextPage ? stringToBase64(tasks[tasks.length -1].id) : '',
            hasNextPage
          }
        };
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
    user: async (parent, _, { loaders }) => {
      try {
        return loaders.user.load(parent.user.toString());
      } catch (err) {
        console.error(err);
      }
    }
  }
}
