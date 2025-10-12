import { Request, Response } from "express";
export interface SSOUser {
    name: string;
    email: string;
    id?: string;
}
export interface SSORequest extends Request {
    user: SSOUser;
}
export declare const googleCallback: (req: SSORequest, res: Response) => Promise<Response>;
export declare const githubCallback: (req: SSORequest, res: Response) => Promise<Response>;
export declare const facebookCallback: (req: SSORequest, res: Response) => Promise<Response>;
//# sourceMappingURL=sso.d.ts.map