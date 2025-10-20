import express from "express";
import adController from "../controllers/ad";
import authMiddleware from "../middleware/auth";
import rateLimit from "express-rate-limit";

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
  authMiddleware as any, // Protect the route
  eligibilityLimiter, // Rate limit the requests
  adController.checkAdEligibility as any
);

export default router;

