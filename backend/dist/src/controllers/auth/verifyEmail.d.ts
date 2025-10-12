import { Request, Response } from "express";
export interface VerifyEmailRequest extends Request {
    query: {
        token: string;
    };
}
declare const verifyEmail: (req: VerifyEmailRequest, res: Response) => Promise<Response>;
export default verifyEmail;
//# sourceMappingURL=verifyEmail.d.ts.map