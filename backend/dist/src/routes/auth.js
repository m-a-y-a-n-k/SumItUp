"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../controllers/auth"));
const auth_2 = __importDefault(require("../middleware/auth"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const validators_1 = require("../middleware/validators");
const router = express_1.default.Router();
// Rate limiting for sensitive routes
const loginLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 requests per windowMs
    message: "Too many login attempts from this IP, please try again later.",
});
const signupLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 requests per windowMs
    message: "Too many signup attempts from this IP, please try again later.",
});
// Basic authentication routes
router.post("/login", validators_1.validateLogin, validators_1.handleValidationErrors, loginLimiter, async (req, res, next) => {
    try {
        await auth_1.default.login(req, res);
    }
    catch (err) {
        next(err);
    }
});
router.post("/signup", validators_1.validateSignup, validators_1.handleValidationErrors, signupLimiter, async (req, res, next) => {
    try {
        await auth_1.default.signup(req, res);
    }
    catch (err) {
        next(err);
    }
});
router.post("/logout", auth_2.default, async (req, res, next) => {
    try {
        await auth_1.default.logout(req, res);
    }
    catch (err) {
        next(err);
    }
});
// Forgot password routes
router.post("/forgot-password", async (req, res, next) => {
    try {
        await auth_1.default.forgotPassword(req, res);
    }
    catch (err) {
        next(err);
    }
});
router.post("/reset-password", async (req, res, next) => {
    try {
        await auth_1.default.resetPassword(req, res);
    }
    catch (err) {
        next(err);
    }
});
// Email verification routes
router.post("/send-verification-email", async (req, res, next) => {
    try {
        await auth_1.default.sendVerificationEmail(req, res);
    }
    catch (err) {
        next(err);
    }
});
router.get("/verify-email", async (req, res, next) => {
    try {
        await auth_1.default.verifyEmail(req, res);
    }
    catch (err) {
        next(err);
    }
});
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
exports.default = router;
//# sourceMappingURL=auth.js.map