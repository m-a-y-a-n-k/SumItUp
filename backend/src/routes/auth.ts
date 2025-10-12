import express, { Request, Response, NextFunction } from "express";
// import passport from "passport";
import { validationResult } from "express-validator";
import authController from "../controllers/auth";
import authMiddleware from "../middleware/auth";
import rateLimit from "express-rate-limit";
import { validateLogin, validateSignup, handleValidationErrors } from "../middleware/validators";

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
router.post("/login", 
  validateLogin, 
  handleValidationErrors,
  loginLimiter, 
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await authController.login(req, res);
    } catch (err) {
      next(err);
    }
  }
);

router.post("/signup",
  validateSignup,
  handleValidationErrors,
  signupLimiter,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await authController.signup(req, res);
    } catch (err) {
      next(err);
    }
  }
);

router.post("/logout", 
  authMiddleware as any, 
  async (req: any, res: Response, next: NextFunction) => {
    try {
      await authController.logout(req, res);
    } catch (err) {
      next(err);
    }
  }
);

// Forgot password routes
router.post("/forgot-password", 
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await authController.forgotPassword(req, res);
    } catch (err) {
      next(err);
    }
  }
);

router.post("/reset-password", 
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await authController.resetPassword(req, res);
    } catch (err) {
      next(err);
    }
  }
);

// Email verification routes
router.post("/send-verification-email", 
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await authController.sendVerificationEmail(req, res);
    } catch (err) {
      next(err);
    }
  }
);

router.get("/verify-email", 
  async (req: any, res: Response, next: NextFunction) => {
    try {
      await authController.verifyEmail(req, res);
    } catch (err) {
      next(err);
    }
  }
);

// SSO routes (commented out until passport is properly configured)
/*
router.get("/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get("/google/callback",
  passport.authenticate("google", { session: false }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await authController.googleCallback(req, res);
    } catch (err) {
      next(err);
    }
  }
);

router.get("/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

router.get("/github/callback",
  passport.authenticate("github", { session: false }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await authController.githubCallback(req, res);
    } catch (err) {
      next(err);
    }
  }
);

router.get("/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);

router.get("/facebook/callback",
  passport.authenticate("facebook", { session: false }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await authController.facebookCallback(req, res);
    } catch (err) {
      next(err);
    }
  }
);
*/

export default router;
