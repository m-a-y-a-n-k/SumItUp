const express = require("express");
const adController = require("../controllers/ad");
const authMiddleware = require("../middleware/auth"); // Ensure to add this import
const rateLimit = require("express-rate-limit"); // Ensure to add this import

const router = express.Router();

// Rate limiter
const eligibilityLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each user to 10 requests per windowMs
  message: "Too many requests, please try again later.",
});

// Route to check ad eligibility for a user
router.get(
  "/check-eligibility",
  authMiddleware, // Protect the route
  eligibilityLimiter, // Rate limit the requests
  adController.checkAdEligibility
);

module.exports = router;
