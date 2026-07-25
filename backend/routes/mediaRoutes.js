import express from 'express';
import { uploadImage, uploadFile } from '../utils/cloudinary.js';
import { protect } from '../middlewares/authMiddleware.js';
import cloudinary from '../utils/cloudinary.js';

const router = express.Router();

// Upload Image
router.post('/upload/image', protect, uploadImage.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No image uploaded' });
  }
  res.status(201).json({
    url: req.file.path,
    publicId: req.file.filename,
    fileType: req.file.mimetype,
    originalName: req.file.originalname,
    fileSize: req.file.size
  });
});

// Upload Document/File
router.post('/upload/file', protect, uploadFile.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  res.status(201).json({
    url: req.file.path,
    publicId: req.file.filename,
    fileType: req.file.mimetype,
    originalName: req.file.originalname,
    fileSize: req.file.size
  });
});

// Delete Media (requires publicId)
router.post('/delete', protect, async (req, res) => {
  const { publicId, resourceType = 'image' } = req.body;
  
  if (!publicId) {
    return res.status(400).json({ message: 'publicId is required' });
  }

  try {
    const result = await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
    res.status(200).json({ message: 'Media deleted', result });
  } catch (error) {
    console.error('Error deleting media:', error);
    res.status(500).json({ message: 'Failed to delete media', error: error.message });
  }
});

export default router;
