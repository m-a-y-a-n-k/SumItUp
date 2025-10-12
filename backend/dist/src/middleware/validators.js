"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleValidationErrors = exports.validateUserPreferences = exports.validateContent = exports.validateLogin = exports.validateSignup = exports.validateSpendToken = exports.validateEarnToken = void 0;
const express_validator_1 = require("express-validator");
// Validate earn tokens request
exports.validateEarnToken = [
    (0, express_validator_1.body)("adId").isString().withMessage("Ad ID is required and must be a string"),
];
// Validate spend tokens request
exports.validateSpendToken = [
    (0, express_validator_1.body)("tokens")
        .isInt({ min: 1 })
        .withMessage("Token count must be a positive integer"),
];
// Validation middleware for signup
exports.validateSignup = [
    (0, express_validator_1.body)("email").isEmail().withMessage("Invalid email address"),
    (0, express_validator_1.body)("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),
    (0, express_validator_1.body)("username")
        .isLength({ min: 2 })
        .withMessage("Username must be at least 2 characters long"),
];
// Validation middleware for login
exports.validateLogin = [
    (0, express_validator_1.body)("email").isEmail().withMessage("Invalid email address"),
    (0, express_validator_1.body)("password").exists().withMessage("Password is required"),
];
// Validation middleware for content creation
exports.validateContent = [
    (0, express_validator_1.body)("title").isLength({ min: 1 }).withMessage("Title is required"),
    (0, express_validator_1.body)("originalContent").isLength({ min: 1 }).withMessage("Content is required"),
    (0, express_validator_1.body)("contentType")
        .isIn(['audio', 'image', 'video', 'gif', 'url', 'pdf', 'book', 'text'])
        .withMessage("Invalid content type"),
];
// Validation middleware for user preferences
exports.validateUserPreferences = [
    (0, express_validator_1.body)("defaultSummaryLength")
        .optional()
        .isIn(['short', 'medium', 'long'])
        .withMessage("Invalid summary length"),
    (0, express_validator_1.body)("summaryStyle")
        .optional()
        .isIn(['bullet-points', 'paragraph', 'keywords', 'abstract'])
        .withMessage("Invalid summary style"),
    (0, express_validator_1.body)("theme")
        .optional()
        .isIn(['light', 'dark', 'auto'])
        .withMessage("Invalid theme"),
];
// Generic validation error handler
const handleValidationErrors = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};
exports.handleValidationErrors = handleValidationErrors;
//# sourceMappingURL=validators.js.map