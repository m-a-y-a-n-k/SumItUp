import { Request, Response, NextFunction } from "express";

const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction): Response => {
  console.error(err.stack);
  return res.status(500).json({ error: "Internal Server Error" });
};

export default errorHandler;
