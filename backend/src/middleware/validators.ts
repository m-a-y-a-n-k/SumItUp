import { body, validationResult, ValidationChain } from "express-validator";
import { Request, Response, NextFunction } from "express";

// Validate earn tokens request
export const validateEarnToken: ValidationChain[] = [
  body("adId").isString().withMessage("Ad ID is required and must be a string"),
];

// Validate spend tokens request
export const validateSpendToken: ValidationChain[] = [
  body("tokens")
    .isInt({ min: 1 })
    .withMessage("Token count must be a positive integer"),
];

// Validation middleware for signup
export const validateSignup: ValidationChain[] = [
  body("email").isEmail().withMessage("Invalid email address"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("username")
    .isLength({ min: 2 })
    .withMessage("Username must be at least 2 characters long"),
];

// Validation middleware for login
export const validateLogin: ValidationChain[] = [
  body("email").isEmail().withMessage("Invalid email address"),
  body("password").exists().withMessage("Password is required"),
];

// Validation middleware for content creation
export const validateContent: ValidationChain[] = [
  body("title").isLength({ min: 1 }).withMessage("Title is required"),
  body("originalContent").isLength({ min: 1 }).withMessage("Content is required"),
  body("contentType")
    .isIn(['audio', 'image', 'video', 'gif', 'url', 'pdf', 'book', 'text'])
    .withMessage("Invalid content type"),
];

// Validation middleware for user preferences
export const validateUserPreferences: ValidationChain[] = [
  body("defaultSummaryLength")
    .optional()
    .isIn(['short', 'medium', 'long'])
    .withMessage("Invalid summary length"),
  body("summaryStyle")
    .optional()
    .isIn(['bullet-points', 'paragraph', 'keywords', 'abstract'])
    .withMessage("Invalid summary style"),
  body("theme")
    .optional()
    .isIn(['light', 'dark', 'auto'])
    .withMessage("Invalid theme"),
];

// Generic validation error handler
export const handleValidationErrors = (req: Request, res: Response, next: NextFunction): Response | void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
