import type { Request, Response } from 'express';
import mongoose from 'mongoose';
import User from '../models/User.js';
import { signToken } from '../utils/auth.js';

interface AuthenticatedRequest extends Request {
  user?: {
    _id: string;
    username: string;
    email: string;
  };
}

export const getSingleUser = async (req: AuthenticatedRequest, res: Response) => {
  const foundUser = await User.findOne({
    $or: [
      { _id: req.user ? req.user._id : req.params.id },
      { username: req.params.username },
    ],
  });

  if (!foundUser) return res.status(400).json({ message: 'User not found' });
  return res.json(foundUser);
};

export const createUser = async (req: Request, res: Response) => {
  const user = await User.create(req.body);
  if (!user) return res.status(400).json({ message: 'Something is wrong' });

  const token = signToken({
    _id: (user._id as mongoose.Types.ObjectId).toString(),
    email: user.email,
    username: user.username,
  });

  return res.json({ token, user });
};

export const login = async (req: Request, res: Response) => {
  const user = await User.findOne({
    $or: [{ username: req.body.username }, { email: req.body.email }],
  });

  if (!user) return res.status(400).json({ message: "Can't find this user" });

  const correctPw = await user.isCorrectPassword(req.body.password);
  if (!correctPw) return res.status(400).json({ message: 'Wrong password!' });

  const token = signToken({
    _id: (user._id as mongoose.Types.ObjectId).toString(),
    email: user.email,
    username: user.username,
  });

  return res.json({ token, user });
};

export const saveBook = async (req: AuthenticatedRequest, res: Response) => {
  const updatedUser = await User.findOneAndUpdate(
    { _id: req.user?._id },
    { $addToSet: { savedBooks: req.body } },
    { new: true, runValidators: true }
  );
  return res.json(updatedUser);
};

export const deleteBook = async (req: AuthenticatedRequest, res: Response) => {
  const updatedUser = await User.findOneAndUpdate(
    { _id: req.user?._id },
    { $pull: { savedBooks: { bookId: req.params.bookId } } },
    { new: true }
  );
  if (!updatedUser) return res.status(404).json({ message: "User not found" });
  return res.json(updatedUser);
};
