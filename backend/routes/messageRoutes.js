import express from 'express';
import {
  sendMessage,
  getInbox,
  markAsRead,
  deleteMessage,
  toggleFavorite,
} from '../controllers/messageController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/send', protect, sendMessage);
router.get('/inbox', protect, getInbox);
router.put('/:id/read', protect, markAsRead);
router.delete('/:id', protect, deleteMessage);
router.put('/:id/favorite', protect, toggleFavorite);

export default router;
