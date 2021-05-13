const { tasks, users } = require('../constans');

module.exports = {
  Query: {
    tasks: () => tasks,
    task: (_, { id }) => tasks.find(task => task.id === id)
  },
  Mutation: {
    createTask: (_, { input }) => {
      const task = { ...input, id: `${tasks.length + 1}` };
      tasks.push(task);
      return task;
    }
  },
  Task: {
    user: ({ userId }) => users.find(user => user.id === userId) // Field Level Resolver
  }
}
