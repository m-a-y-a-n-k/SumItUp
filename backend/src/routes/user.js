const express = require("express");
const preferencesController = require("../controllers/user/preferences");
const authMiddleware = require("../middleware/auth");
const { body } = require("express-validator");
const validateRequest = require("../middleware/validation");

const router = express.Router();

// Validation for preference updates
const validatePreferences = [
  body("defaultSummaryLength").optional().isIn(['short', 'medium', 'long']).withMessage("Invalid summary length"),
  body("summaryStyle").optional().isIn(['bullet-points', 'paragraph', 'keywords', 'abstract']).withMessage("Invalid summary style"),
  body("preferredLanguage").optional().isString().withMessage("Language must be a string"),
  body("processingQuality").optional().isIn(['fast', 'balanced', 'high']).withMessage("Invalid processing quality"),
  body("autoSaveContent").optional().isBoolean().withMessage("Auto save must be boolean"),
  body("defaultPrivacy").optional().isIn(['private', 'public']).withMessage("Invalid privacy setting"),
  body("emailNotifications").optional().isBoolean().withMessage("Email notifications must be boolean"),
  body("processingNotifications").optional().isBoolean().withMessage("Processing notifications must be boolean"),
  body("weeklyDigest").optional().isBoolean().withMessage("Weekly digest must be boolean"),
  body("theme").optional().isIn(['light', 'dark', 'auto']).withMessage("Invalid theme"),
  body("itemsPerPage").optional().isInt({ min: 5, max: 50 }).withMessage("Items per page must be between 5 and 50"),
  body("favoriteContentTypes").optional().isArray().withMessage("Favorite content types must be an array"),
  body("interests").optional().isArray().withMessage("Interests must be an array"),
  validateRequest
];

// Get user preferences
router.get("/preferences", authMiddleware, preferencesController.getPreferences);

// Update user preferences
router.put("/preferences", authMiddleware, validatePreferences, preferencesController.updatePreferences);

// Reset preferences to default
router.post("/preferences/reset", authMiddleware, preferencesController.resetPreferences);

// Add interests
router.post("/preferences/interests", 
  authMiddleware,
  body("interests").isArray().withMessage("Interests must be an array"),
  validateRequest,
  preferencesController.addInterests
);

// Remove interests
router.delete("/preferences/interests", 
  authMiddleware,
  body("interests").isArray().withMessage("Interests must be an array"),
  validateRequest,
  preferencesController.removeInterests
);

module.exports = router;
