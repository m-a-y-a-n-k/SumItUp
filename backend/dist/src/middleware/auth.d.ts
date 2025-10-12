import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../types";
declare const authMiddleware: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Response | void;
export default authMiddleware;
//# sourceMappingURL=auth.d.ts.map