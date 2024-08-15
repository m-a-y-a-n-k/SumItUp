const { body, validationResult } = require("express-validator");

// Validate earn tokens request
const validateEarnToken = [
  body("adId").isString().withMessage("Ad ID is required and must be a string"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Validate spend tokens request
const validateSpendToken = [
  body("tokens")
    .isInt({ min: 1 })
    .withMessage("Token count must be a positive integer"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = { validateEarnToken, validateSpendToken };
