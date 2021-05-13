const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { combineResolvers } = require('graphql-resolvers');

const User = require('../database/models/User');
const Task = require('../database/models/Task');
const { isAuthenticated } = require('./middleware');

module.exports = {
  Query: {
    user: combineResolvers(isAuthenticated, async (_, __, { userId }) => {
      try {
        return User.findById(userId).populate({ path: 'tasks' });
      } catch (err) {
        console.error(err);
        throw err;
      }
    })
  },
  Mutation: {
    signup: async (_, { input }) => {
      try {
        const user = await User.findOne({ email: input.email });

        if (user) {
          throw new Error('Email is already in use.');
        }

        const hashedPassword = await bcrypt.hash(input.password, 12);
        const newUser = new User({
          ...input,
          password: hashedPassword
        });

        return newUser.save();
      } catch (err) {
        console.error(err);
        throw err;
      }
    },
    login: async (_, { input }) => {
      try {
        const user = await User.findOne({ email: input.email });
        if (!user) {
          throw new Error('User was not found.');
        }

        const isPasswordValid = await bcrypt.compare(input.password, user.password);
        if (!isPasswordValid) {
          throw new Error('Invalid password');
        }

        const secret = process.env.JWT_SECRET_KEY;
        const token = jwt.sign({ id: user._id }, secret, { expiresIn: '1d' });

        return { token };
      } catch (err) {
        console.error(err);
        throw err;
      }
    }
  },
  User: {
    tasks: async ({ id }) => {
      try {
        return Task.find({ user: id });
      } catch (err) {
        console.error(err);
        throw err;
      }
    }
  }
}
