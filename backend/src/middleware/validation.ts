import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

const validateRequest = (req: Request, res: Response, next: NextFunction): Response | void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export default validateRequest;
