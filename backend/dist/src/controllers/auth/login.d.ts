import { Request, Response } from "express";
export interface LoginRequest extends Request {
    body: {
        email: string;
        password: string;
    };
}
declare const login: (req: LoginRequest, res: Response) => Promise<Response>;
export default login;
//# sourceMappingURL=login.d.ts.map