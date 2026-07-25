import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import {
  getConversations,
  createOrGetConversation,
  getDirectMessages
} from '../controllers/conversationController.js';

const router = express.Router();

router.use(protect);

router.get('/', getConversations);
router.post('/', createOrGetConversation);
router.get('/:id/messages', getDirectMessages);

export default router;
