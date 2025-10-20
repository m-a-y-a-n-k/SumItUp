import express from "express";
import preferencesController from "../controllers/user/preferences";
import authMiddleware from "../middleware/auth";
import { body } from "express-validator";
import validateRequest from "../middleware/validation";

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
router.get("/preferences", authMiddleware as any, preferencesController.getPreferences as any);

// Update user preferences
router.put("/preferences", authMiddleware as any, validatePreferences, preferencesController.updatePreferences as any);

// Reset preferences to default
router.post("/preferences/reset", authMiddleware as any, preferencesController.resetPreferences as any);

// Add interests
router.post("/preferences/interests", 
  authMiddleware as any,
  body("interests").isArray().withMessage("Interests must be an array"),
  validateRequest,
  preferencesController.addInterests as any
);

// Remove interests
router.delete("/preferences/interests", 
  authMiddleware as any,
  body("interests").isArray().withMessage("Interests must be an array"),
  validateRequest,
  preferencesController.removeInterests as any
);

export default router;

