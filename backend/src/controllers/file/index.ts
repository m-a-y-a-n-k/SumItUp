import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { AuthenticatedRequest, UploadedFile } from "../../types";

const UPLOAD_DIR = path.join(__dirname, "../../../uploads");
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

interface AllowedTypes {
  [key: string]: string;
}

const ALLOWED_TYPES: AllowedTypes = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif',
  'audio/mpeg': 'mp3',
  'audio/mp3': 'mp3',
  'audio/wav': 'wav',
  'application/pdf': 'pdf',
  'text/plain': 'txt'
};

interface UploadRequest extends AuthenticatedRequest {
  file?: UploadedFile;
}

interface FileParams extends Record<string, string> {
  fileId: string;
}

interface ListFilesRequest extends Request {
  query: {
    limit?: string;
    offset?: string;
  };
}

interface FileMetadata {
  id: string;
  originalName: string;
  filename: string;
  mimetype: string;
  size: number;
  uploadedAt: Date;
  userId: string | null;
  path: string;
}

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const fileController = {
  async uploadFile(req: UploadRequest, res: Response): Promise<Response> {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const { originalname, mimetype, size, buffer } = req.file;

      // Validate file type
      if (!ALLOWED_TYPES[mimetype]) {
        return res.status(400).json({
          error: "File type not supported",
          supportedTypes: Object.keys(ALLOWED_TYPES)
        });
      }

      // Validate file size
      if (size > MAX_FILE_SIZE) {
        return res.status(400).json({
          error: `File too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB`
        });
      }

      // Generate unique filename
      const fileId = crypto.randomBytes(16).toString('hex');
      const extension = ALLOWED_TYPES[mimetype];
      const filename = `${fileId}.${extension}`;
      const filepath = path.join(UPLOAD_DIR, filename);

      // Save file
      fs.writeFileSync(filepath, buffer);

      // File metadata
      const fileMetadata: FileMetadata = {
        id: fileId,
        originalName: originalname,
        filename: filename,
        mimetype: mimetype,
        size: size,
        uploadedAt: new Date(),
        userId: req.user?.id || null,
        path: filepath
      };

      return res.status(200).json({
        message: "File uploaded successfully",
        file: {
          id: fileId,
          originalName: originalname,
          filename: filename,
          size: size,
          type: mimetype,
          uploadedAt: fileMetadata.uploadedAt
        }
      });

    } catch (error) {
      console.error("Error uploading file:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },

  async downloadFile(req: Request & { params: FileParams }, res: Response): Promise<Response | void> {
    try {
      const { fileId } = req.params;

      if (!fileId) {
        return res.status(400).json({ error: "File ID is required" });
      }

      // Find file (in a real app, this would be from database)
      const files = fs.readdirSync(UPLOAD_DIR);
      const matchingFile = files.find(file => file.startsWith(fileId));

      if (!matchingFile) {
        return res.status(404).json({ error: "File not found" });
      }

      const filepath = path.join(UPLOAD_DIR, matchingFile);

      // Check if file exists
      if (!fs.existsSync(filepath)) {
        return res.status(404).json({ error: "File not found on disk" });
      }

      // Get file stats
      const stats = fs.statSync(filepath);
      const extension = path.extname(matchingFile);
      const mimeType = Object.keys(ALLOWED_TYPES).find(
        key => ALLOWED_TYPES[key] === extension.substring(1)
      ) || 'application/octet-stream';

      // Set headers
      res.setHeader('Content-Type', mimeType);
      res.setHeader('Content-Length', stats.size);
      res.setHeader('Content-Disposition', `attachment; filename="${matchingFile}"`);

      // Stream file
      const fileStream = fs.createReadStream(filepath);
      fileStream.pipe(res);

    } catch (error) {
      console.error("Error downloading file:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },

  async deleteFile(req: Request & { params: FileParams }, res: Response): Promise<Response> {
    try {
      const { fileId } = req.params;

      if (!fileId) {
        return res.status(400).json({ error: "File ID is required" });
      }

      // Find file
      const files = fs.readdirSync(UPLOAD_DIR);
      const matchingFile = files.find(file => file.startsWith(fileId));

      if (!matchingFile) {
        return res.status(404).json({ error: "File not found" });
      }

      const filepath = path.join(UPLOAD_DIR, matchingFile);

      // Delete file
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }

      return res.status(200).json({ message: "File deleted successfully" });

    } catch (error) {
      console.error("Error deleting file:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },

  async listFiles(req: ListFilesRequest, res: Response): Promise<Response> {
    try {
      const { limit = "10", offset = "0" } = req.query;

      // Get all files (in a real app, this would be from database with user filtering)
      const files = fs.readdirSync(UPLOAD_DIR);

      const fileList = files
        .slice(parseInt(offset), parseInt(offset) + parseInt(limit))
        .map(filename => {
          const filepath = path.join(UPLOAD_DIR, filename);
          const stats = fs.statSync(filepath);
          const fileId = filename.split('.')[0];

          return {
            id: fileId,
            filename: filename,
            size: stats.size,
            uploadedAt: stats.birthtime,
            lastModified: stats.mtime
          };
        });

      return res.status(200).json({
        files: fileList,
        total: files.length,
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

    } catch (error) {
      console.error("Error listing files:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
};

export default fileController;
