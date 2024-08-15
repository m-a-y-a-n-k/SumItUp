const express = require("express");
const rateLimit = require("express-rate-limit");

const tokenController = require("../controllers/token");
const authMiddleware = require("../middleware/auth"); // Authentication middleware
const {
  validateEarnToken,
  validateSpendToken,
} = require("../middleware/validators"); // Input validation middleware

const router = express.Router();

const earnTokenLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each user to 5 requests per windowMs
  message: "Too many requests, please try again later.",
});

// Earn tokens route - protected and validated
router.post(
  "/earn",
  authMiddleware,
  earnTokenLimiter,
  validateEarnToken,
  tokenController.earnTokens
);

// Spend tokens route - protected and validated
router.post(
  "/spend",
  authMiddleware,
  validateSpendToken,
  tokenController.spendTokens
);

module.exports = router;
