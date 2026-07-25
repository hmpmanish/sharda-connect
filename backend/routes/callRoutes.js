import express from 'express';
import { getCallHistory, deleteCallRecord } from '../controllers/callController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/history', protect, getCallHistory);
router.delete('/:id', protect, deleteCallRecord);

export default router;
