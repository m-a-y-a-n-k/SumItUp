import express from "express";
import contentController from "../controllers/content";
import authMiddleware from "../middleware/auth";
import { body, query } from "express-validator";
import validateRequest from "../middleware/validation";

const router = express.Router();

// Validation middleware for saving content
const validateSaveContent = [
  body("title").trim().isLength({ min: 1, max: 200 }).withMessage("Title must be 1-200 characters"),
  body("originalContent").trim().isLength({ min: 1 }).withMessage("Original content is required"),
  body("summary").trim().isLength({ min: 1 }).withMessage("Summary is required"),
  body("contentType").isIn(['audio', 'image', 'video', 'gif', 'url', 'pdf', 'book', 'text']).withMessage("Invalid content type"),
  body("tags").optional().isArray().withMessage("Tags must be an array"),
  validateRequest
];

// Validation for pagination
const validatePagination = [
  query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("Limit must be between 1 and 100"),
  query("offset").optional().isInt({ min: 0 }).withMessage("Offset must be non-negative"),
  validateRequest
];

// Save processed content
router.post("/save", authMiddleware as any, validateSaveContent, contentController.saveContent as any);

// Get content history
router.get("/history", authMiddleware as any, validatePagination, contentController.getHistory as any);

// Get specific content
router.get("/:contentId", authMiddleware as any, contentController.getContent as any);

// Toggle favorite status
router.put("/:contentId/favorite", authMiddleware as any, contentController.toggleFavorite as any);

// Get favorites
router.get("/favorites/list", authMiddleware as any, validatePagination, contentController.getFavorites as any);

// Add tags to content
router.put("/:contentId/tags/add", 
  authMiddleware as any, 
  body("tags").isArray().withMessage("Tags must be an array"),
  validateRequest,
  contentController.addTags as any
);

// Remove tags from content
router.put("/:contentId/tags/remove", 
  authMiddleware as any,
  body("tags").isArray().withMessage("Tags must be an array"),
  validateRequest,
  contentController.removeTags as any
);

// Delete content
router.delete("/:contentId", authMiddleware as any, contentController.deleteContent as any);

// Search content by tags
router.get("/search/tags", authMiddleware as any, contentController.searchByTags as any);

export default router;
