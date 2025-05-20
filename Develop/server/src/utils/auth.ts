import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';

export interface DecodedUser {
  _id: string;
  username: string;
  email: string;
}

export function signToken(user: DecodedUser): string {
  return jwt.sign(
    {
      _id: user._id,
      email: user.email,
      username: user.username,
    },
    process.env.JWT_SECRET!,
    { expiresIn: '2h' }
  );
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedUser;
    // @ts-ignore
    req.user = decoded;
    next();
  } catch {
    return res.status(403).json({ message: 'Invalid token' });
  }
}
