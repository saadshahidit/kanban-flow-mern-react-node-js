import { Router } from 'express';
import {
  getBoards,
  createBoard,
  updateBoard,
  deleteBoard,
} from '../controllers/boardController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

// All board routes require authentication
router.use(protect);

router.get('/', getBoards);
router.post('/', createBoard);
router.put('/:id', updateBoard);
router.delete('/:id', deleteBoard);

export default router;
