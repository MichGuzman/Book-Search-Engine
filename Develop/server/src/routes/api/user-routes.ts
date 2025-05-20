// server/src/routes/api/user-routes.ts
import express from 'express';
import {
  createUser,
  getSingleUser,
  saveBook,
  deleteBook,
  login,
} from '../../controllers/user-controller.js';
import { authMiddleware } from '../../utils/auth.js';

const router = express.Router();

router.route('/').post(createUser).put(authMiddleware, saveBook);
router.route('/login').post(login);
router.route('/me').get(authMiddleware, getSingleUser);
router.route('/books/:bookId').delete(authMiddleware, deleteBook);

export default router;
