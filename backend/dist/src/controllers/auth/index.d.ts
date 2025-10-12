declare const authController: {
    login: (req: import("./login").LoginRequest, res: import("express").Response) => Promise<import("express").Response>;
    signup: (req: import("./signup").SignupRequest, res: import("express").Response) => Promise<import("express").Response>;
    logout: (req: import("express").Request, res: import("express").Response) => import("express").Response;
    forgotPassword: (req: import("./forgotPassword").ForgotPasswordRequest, res: import("express").Response) => Promise<import("express").Response>;
    resetPassword: (req: import("./resetPassword").ResetPasswordRequest, res: import("express").Response) => Promise<import("express").Response>;
    sendVerificationEmail: (req: import("./sendVerificationEmail").SendVerificationEmailRequest, res: import("express").Response) => Promise<import("express").Response>;
    verifyEmail: (req: import("./verifyEmail").VerifyEmailRequest, res: import("express").Response) => Promise<import("express").Response>;
    googleCallback: (req: import("./sso").SSORequest, res: import("express").Response) => Promise<import("express").Response>;
    githubCallback: (req: import("./sso").SSORequest, res: import("express").Response) => Promise<import("express").Response>;
    facebookCallback: (req: import("./sso").SSORequest, res: import("express").Response) => Promise<import("express").Response>;
};
export default authController;
//# sourceMappingURL=index.d.ts.map