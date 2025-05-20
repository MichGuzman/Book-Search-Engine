// server/schemas/resolvers.ts
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import { AuthenticationError } from 'apollo-server-errors';
import jwt from 'jsonwebtoken';


export const resolvers = {
  Query: {
    me: async (_: unknown, __: unknown, context: { user: any }) => {
      if (context.user) {
        return await User.findById(context.user._id);
      }
      throw new AuthenticationError('Not logged in');
    },
  },

  Mutation: {
    addUser: async (
      _: unknown,
      args: { username: string; email: string; password: string }
    ) => {
      try {
        console.log('📥 Received signup args:', args);

        const user = await User.create(args);

        console.log('✅ User created:', user);

        const token = jwt.sign(
          { _id: user._id, email: user.email, username: user.username },
          process.env.JWT_SECRET!,
          { expiresIn: '2h' }
        );

        return { token, user };
      } catch (err: any) {
        console.error('❌ Error in addUser mutation:', err.message);
        throw new Error('Signup failed: ' + err.message);
      }
    },

    login: async (
      _: unknown,
      { email, password }: { email: string; password: string }
    ) => {
      const user = await User.findOne({ email });
      if (!user) throw new AuthenticationError('User not found');

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) throw new AuthenticationError('Incorrect credentials');

      const token = jwt.sign(
        { _id: user._id, email: user.email, username: user.username },
        process.env.JWT_SECRET!,
        { expiresIn: '2h' }
      );
      return { token, user };
    },

    saveBook: async (
      _: unknown,
      { input }: { input: any },
      context: { user: any }
    ) => {
      if (context.user) {
        return await User.findByIdAndUpdate(
          context.user._id,
          { $addToSet: { savedBooks: input } },
          { new: true }
        );
      }
      throw new AuthenticationError('Not logged in');
    },

    removeBook: async (
      _: unknown,
      { bookId }: { bookId: string },
      context: { user: any }
    ) => {
      if (context.user) {
        return await User.findByIdAndUpdate(
          context.user._id,
          { $pull: { savedBooks: { bookId } } },
          { new: true }
        );
      }
      throw new AuthenticationError('Not logged in');
    },
  },
};
