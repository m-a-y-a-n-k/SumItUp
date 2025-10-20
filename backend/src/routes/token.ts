import express from "express";
import rateLimit from "express-rate-limit";
import tokenController from "../controllers/token";
import authMiddleware from "../middleware/auth";
import { validateEarnToken, validateSpendToken } from "../middleware/validators";

const router = express.Router();

const earnTokenLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each user to 5 requests per windowMs
  message: "Too many requests, please try again later.",
});

// Earn tokens route - protected and validated
router.post(
  "/earn",
  authMiddleware as any,
  earnTokenLimiter,
  validateEarnToken,
  tokenController.earnTokens as any
);

// Spend tokens route - protected and validated
router.post(
  "/spend",
  authMiddleware as any,
  validateSpendToken,
  tokenController.spendTokens as any
);

export default router;

