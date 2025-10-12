import forgotPassword from "./forgotPassword";
import login from "./login";
import logout from "./logout";
import resetPassword from "./resetPassword";
import sendVerificationEmail from "./sendVerificationEmail";
import signup from "./signup";
import { googleCallback, githubCallback, facebookCallback } from "./sso";
import verifyEmail from "./verifyEmail";

const authController = {
  login,
  signup,
  logout,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
  googleCallback,
  githubCallback,
  facebookCallback,
};

export default authController;
