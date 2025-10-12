"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const crypto_1 = __importDefault(require("crypto"));
const UPLOAD_DIR = path_1.default.join(__dirname, "../../../uploads");
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif',
    'audio/mpeg': 'mp3',
    'audio/wav': 'wav',
    'application/pdf': 'pdf',
    'text/plain': 'txt'
};
// Ensure upload directory exists
if (!fs_1.default.existsSync(UPLOAD_DIR)) {
    fs_1.default.mkdirSync(UPLOAD_DIR, { recursive: true });
}
const fileController = {
    async uploadFile(req, res) {
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
            const fileId = crypto_1.default.randomBytes(16).toString('hex');
            const extension = ALLOWED_TYPES[mimetype];
            const filename = `${fileId}.${extension}`;
            const filepath = path_1.default.join(UPLOAD_DIR, filename);
            // Save file
            fs_1.default.writeFileSync(filepath, buffer);
            // File metadata
            const fileMetadata = {
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
        }
        catch (error) {
            console.error("Error uploading file:", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },
    async downloadFile(req, res) {
        try {
            const { fileId } = req.params;
            if (!fileId) {
                return res.status(400).json({ error: "File ID is required" });
            }
            // Find file (in a real app, this would be from database)
            const files = fs_1.default.readdirSync(UPLOAD_DIR);
            const matchingFile = files.find(file => file.startsWith(fileId));
            if (!matchingFile) {
                return res.status(404).json({ error: "File not found" });
            }
            const filepath = path_1.default.join(UPLOAD_DIR, matchingFile);
            // Check if file exists
            if (!fs_1.default.existsSync(filepath)) {
                return res.status(404).json({ error: "File not found on disk" });
            }
            // Get file stats
            const stats = fs_1.default.statSync(filepath);
            const extension = path_1.default.extname(matchingFile);
            const mimeType = Object.keys(ALLOWED_TYPES).find(key => ALLOWED_TYPES[key] === extension.substring(1)) || 'application/octet-stream';
            // Set headers
            res.setHeader('Content-Type', mimeType);
            res.setHeader('Content-Length', stats.size);
            res.setHeader('Content-Disposition', `attachment; filename="${matchingFile}"`);
            // Stream file
            const fileStream = fs_1.default.createReadStream(filepath);
            fileStream.pipe(res);
        }
        catch (error) {
            console.error("Error downloading file:", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },
    async deleteFile(req, res) {
        try {
            const { fileId } = req.params;
            if (!fileId) {
                return res.status(400).json({ error: "File ID is required" });
            }
            // Find file
            const files = fs_1.default.readdirSync(UPLOAD_DIR);
            const matchingFile = files.find(file => file.startsWith(fileId));
            if (!matchingFile) {
                return res.status(404).json({ error: "File not found" });
            }
            const filepath = path_1.default.join(UPLOAD_DIR, matchingFile);
            // Delete file
            if (fs_1.default.existsSync(filepath)) {
                fs_1.default.unlinkSync(filepath);
            }
            return res.status(200).json({ message: "File deleted successfully" });
        }
        catch (error) {
            console.error("Error deleting file:", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },
    async listFiles(req, res) {
        try {
            const { limit = "10", offset = "0" } = req.query;
            // Get all files (in a real app, this would be from database with user filtering)
            const files = fs_1.default.readdirSync(UPLOAD_DIR);
            const fileList = files
                .slice(parseInt(offset), parseInt(offset) + parseInt(limit))
                .map(filename => {
                const filepath = path_1.default.join(UPLOAD_DIR, filename);
                const stats = fs_1.default.statSync(filepath);
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
        }
        catch (error) {
            console.error("Error listing files:", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }
};
exports.default = fileController;
//# sourceMappingURL=index.js.map