import { Request, Response } from "express";
export interface ForgotPasswordRequest extends Request {
    body: {
        email: string;
    };
}
declare const forgotPassword: (req: ForgotPasswordRequest, res: Response) => Promise<Response>;
export default forgotPassword;
//# sourceMappingURL=forgotPassword.d.ts.map