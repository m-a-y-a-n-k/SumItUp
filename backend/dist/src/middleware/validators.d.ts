import { ValidationChain } from "express-validator";
import { Request, Response, NextFunction } from "express";
export declare const validateEarnToken: ValidationChain[];
export declare const validateSpendToken: ValidationChain[];
export declare const validateSignup: ValidationChain[];
export declare const validateLogin: ValidationChain[];
export declare const validateContent: ValidationChain[];
export declare const validateUserPreferences: ValidationChain[];
export declare const handleValidationErrors: (req: Request, res: Response, next: NextFunction) => Response | void;
//# sourceMappingURL=validators.d.ts.map