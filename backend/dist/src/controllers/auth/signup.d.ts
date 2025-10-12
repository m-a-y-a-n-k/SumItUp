import { Request, Response } from "express";
export interface SignupRequest extends Request {
    body: {
        username: string;
        email: string;
        password: string;
    };
}
declare const signup: (req: SignupRequest, res: Response) => Promise<Response>;
export default signup;
//# sourceMappingURL=signup.d.ts.map