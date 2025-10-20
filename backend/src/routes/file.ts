import express, { Request, Response, NextFunction } from "express";
import multer from "multer";
import fileController from "../controllers/file";
import authMiddleware from "../middleware/auth";

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
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
      cb(new Error('File type not supported'));
    }
  }
});

// File upload endpoint
router.post("/upload", authMiddleware as any, upload.single('file'), fileController.uploadFile as any);

// File download endpoint
router.get("/download/:fileId", fileController.downloadFile as any);

// File deletion endpoint  
router.delete("/:fileId", authMiddleware as any, fileController.deleteFile as any);

// List files endpoint
router.get("/list", authMiddleware as any, fileController.listFiles as any);

// Error handling for multer
router.use((error: any, req: Request, res: Response, next: NextFunction): void => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      res.status(400).json({ error: 'File too large' });
      return;
    }
  }
  
  if (error.message === 'File type not supported') {
    res.status(400).json({ error: 'File type not supported' });
    return;
  }
  
  next(error);
});

export default router;

