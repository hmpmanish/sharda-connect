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
  
  const baseUrl = process.env.BACKEND_URL || `${req.protocol}://${req.get('host')}`;
  const fileUrl = `${baseUrl}/${req.file.path.replace(/\\/g, '/')}`;
  
  res.status(201).json({
    url: fileUrl,
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
  
  const baseUrl = process.env.BACKEND_URL || `${req.protocol}://${req.get('host')}`;
  const fileUrl = `${baseUrl}/${req.file.path.replace(/\\/g, '/')}`;

  res.status(201).json({
    url: fileUrl,
    publicId: req.file.filename,
    fileType: req.file.mimetype,
    originalName: req.file.originalname,
    fileSize: req.file.size
  });
});

// Delete Media (requires publicId)
router.post('/delete', protect, async (req, res) => {
  const { publicId } = req.body;
  
  if (!publicId) {
    return res.status(400).json({ message: 'publicId (filename) is required' });
  }

  try {
    const fs = await import('fs');
    const path = await import('path');
    
    // Construct the file path inside the uploads directory
    const filePath = path.join(process.cwd(), 'uploads', publicId);

    // Check if file exists and delete it
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return res.status(200).json({ message: 'Media deleted locally' });
    } else {
      return res.status(404).json({ message: 'File not found' });
    }
  } catch (error) {
    console.error('Error deleting media:', error);
    res.status(500).json({ message: 'Failed to delete media', error: error.message });
  }
});

export default router;
