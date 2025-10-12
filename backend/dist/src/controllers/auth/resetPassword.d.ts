import { Request, Response } from "express";
export interface ResetPasswordRequest extends Request {
    body: {
        token: string;
        newPassword: string;
    };
}
declare const resetPassword: (req: ResetPasswordRequest, res: Response) => Promise<Response>;
export default resetPassword;
//# sourceMappingURL=resetPassword.d.ts.map