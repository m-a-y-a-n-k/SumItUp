const express = require("express");
const contentController = require("../controllers/content");
const authMiddleware = require("../middleware/auth");
const { body, query } = require("express-validator");
const validateRequest = require("../middleware/validation");

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
router.post("/save", authMiddleware, validateSaveContent, contentController.saveContent);

// Get content history
router.get("/history", authMiddleware, validatePagination, contentController.getHistory);

// Get specific content
router.get("/:contentId", authMiddleware, contentController.getContent);

// Toggle favorite status
router.put("/:contentId/favorite", authMiddleware, contentController.toggleFavorite);

// Get favorites
router.get("/favorites/list", authMiddleware, validatePagination, contentController.getFavorites);

// Add tags to content
router.put("/:contentId/tags/add", 
  authMiddleware, 
  body("tags").isArray().withMessage("Tags must be an array"),
  validateRequest,
  contentController.addTags
);

// Remove tags from content
router.put("/:contentId/tags/remove", 
  authMiddleware,
  body("tags").isArray().withMessage("Tags must be an array"),
  validateRequest,
  contentController.removeTags
);

// Delete content
router.delete("/:contentId", authMiddleware, contentController.deleteContent);

// Search content by tags
router.get("/search/tags", authMiddleware, contentController.searchByTags);

module.exports = router;
