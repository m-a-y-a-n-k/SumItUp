const express = require("express");
const multer = require("multer");
const fileController = require("../controllers/file");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'image/jpeg',
      'image/png', 
      'image/gif',
      'audio/mpeg',
      'audio/wav',
      'application/pdf',
      'text/plain'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('File type not supported'), false);
    }
  }
});

// File upload endpoint
router.post("/upload", authMiddleware, upload.single('file'), fileController.uploadFile);

// File download endpoint
router.get("/download/:fileId", fileController.downloadFile);

// File deletion endpoint  
router.delete("/:fileId", authMiddleware, fileController.deleteFile);

// List files endpoint
router.get("/list", authMiddleware, fileController.listFiles);

// Error handling for multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large' });
    }
  }
  
  if (error.message === 'File type not supported') {
    return res.status(400).json({ error: 'File type not supported' });
  }
  
  next(error);
});

module.exports = router;
