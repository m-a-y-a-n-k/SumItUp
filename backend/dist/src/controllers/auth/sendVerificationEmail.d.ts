import { Request, Response } from "express";
export interface SendVerificationEmailRequest extends Request {
    body: {
        email: string;
    };
}
declare const sendVerificationEmail: (req: SendVerificationEmailRequest, res: Response) => Promise<Response>;
export default sendVerificationEmail;
//# sourceMappingURL=sendVerificationEmail.d.ts.map