import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import {
  searchUsers,
  getConnections,
  sendConnectionRequest,
  updateConnectionStatus,
  removeConnection
} from '../controllers/connectionController.js';

const router = express.Router();

router.use(protect);

router.get('/search', searchUsers);
router.get('/', getConnections);
router.post('/request/:id', sendConnectionRequest);
router.put('/:id', updateConnectionStatus);
router.delete('/:id', removeConnection);

export default router;
