"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const content_1 = __importDefault(require("../controllers/content"));
const auth_1 = __importDefault(require("../middleware/auth"));
const express_validator_1 = require("express-validator");
const validation_1 = __importDefault(require("../middleware/validation"));
const router = express_1.default.Router();
// Validation middleware for saving content
const validateSaveContent = [
    (0, express_validator_1.body)("title").trim().isLength({ min: 1, max: 200 }).withMessage("Title must be 1-200 characters"),
    (0, express_validator_1.body)("originalContent").trim().isLength({ min: 1 }).withMessage("Original content is required"),
    (0, express_validator_1.body)("summary").trim().isLength({ min: 1 }).withMessage("Summary is required"),
    (0, express_validator_1.body)("contentType").isIn(['audio', 'image', 'video', 'gif', 'url', 'pdf', 'book', 'text']).withMessage("Invalid content type"),
    (0, express_validator_1.body)("tags").optional().isArray().withMessage("Tags must be an array"),
    validation_1.default
];
// Validation for pagination
const validatePagination = [
    (0, express_validator_1.query)("limit").optional().isInt({ min: 1, max: 100 }).withMessage("Limit must be between 1 and 100"),
    (0, express_validator_1.query)("offset").optional().isInt({ min: 0 }).withMessage("Offset must be non-negative"),
    validation_1.default
];
// Save processed content
router.post("/save", auth_1.default, validateSaveContent, content_1.default.saveContent);
// Get content history
router.get("/history", auth_1.default, validatePagination, content_1.default.getHistory);
// Get specific content
router.get("/:contentId", auth_1.default, content_1.default.getContent);
// Toggle favorite status
router.put("/:contentId/favorite", auth_1.default, content_1.default.toggleFavorite);
// Get favorites
router.get("/favorites/list", auth_1.default, validatePagination, content_1.default.getFavorites);
// Add tags to content
router.put("/:contentId/tags/add", auth_1.default, (0, express_validator_1.body)("tags").isArray().withMessage("Tags must be an array"), validation_1.default, content_1.default.addTags);
// Remove tags from content
router.put("/:contentId/tags/remove", auth_1.default, (0, express_validator_1.body)("tags").isArray().withMessage("Tags must be an array"), validation_1.default, content_1.default.removeTags);
// Delete content
router.delete("/:contentId", auth_1.default, content_1.default.deleteContent);
// Search content by tags
router.get("/search/tags", auth_1.default, content_1.default.searchByTags);
exports.default = router;
//# sourceMappingURL=content.js.map