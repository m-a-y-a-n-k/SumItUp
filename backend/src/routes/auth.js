const express = require("express");
// const passport = require("passport");
const { validationResult } = require("express-validator");
const authController = require("../controllers/auth");
const authMiddleware = require("../middleware/auth");
const rateLimit = require("express-rate-limit");
const { validateLogin, validateSignup } = require("../middleware/validators");

const router = express.Router();

// Rate limiting for sensitive routes
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: "Too many login attempts from this IP, please try again later.",
});

const signupLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: "Too many signup attempts from this IP, please try again later.",
});

// Basic authentication routes
router.post("/login", validateLogin, loginLimiter, async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    await authController.login(req, res);
  } catch (err) {
    next(err);
  }
});

router.post(
  "/signup",
  validateSignup,
  signupLimiter,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      await authController.signup(req, res);
    } catch (err) {
      next(err);
    }
  }
);

router.post("/logout", authMiddleware, async (req, res, next) => {
  try {
    await authController.logout(req, res);
  } catch (err) {
    next(err);
  }
});

// Forgot password routes
router.post("/forgot-password", async (req, res, next) => {
  try {
    await authController.forgotPassword(req, res);
  } catch (err) {
    next(err);
  }
});

router.post("/reset-password", async (req, res, next) => {
  try {
    await authController.resetPassword(req, res);
  } catch (err) {
    next(err);
  }
});

// Email verification routes
router.post("/send-verification-email", async (req, res, next) => {
  try {
    await authController.sendVerificationEmail(req, res);
  } catch (err) {
    next(err);
  }
});

router.get("/verify-email", async (req, res, next) => {
  try {
    await authController.verifyEmail(req, res);
  } catch (err) {
    next(err);
  }
});

// SSO routes
// router.get(
//   "/google",
//   passport.authenticate("google", { scope: ["profile", "email"] })
// );

// router.get(
//   "/google/callback",
//   passport.authenticate("google", { session: false }),
//   async (req, res, next) => {
//     try {
//       await authController.googleCallback(req, res);
//     } catch (err) {
//       next(err);
//     }
//   }
// );

// router.get(
//   "/github",
//   passport.authenticate("github", { scope: ["user:email"] })
// );

// router.get(
//   "/github/callback",
//   passport.authenticate("github", { session: false }),
//   async (req, res, next) => {
//     try {
//       await authController.githubCallback(req, res);
//     } catch (err) {
//       next(err);
//     }
//   }
// );

// router.get(
//   "/facebook",
//   passport.authenticate("facebook", { scope: ["email"] })
// );

// router.get(
//   "/facebook/callback",
//   passport.authenticate("facebook", { session: false }),
//   async (req, res, next) => {
//     try {
//       await authController.facebookCallback(req, res);
//     } catch (err) {
//       next(err);
//     }
//   }
// );

module.exports = router;
