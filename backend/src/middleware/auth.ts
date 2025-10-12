import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthenticatedRequest, JwtPayload } from "../types";

const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction): Response | void => {
  const authHeader = req.header("Authorization");
  
  if (!authHeader) {
    return res.status(401).send({ error: "Authentication required" });
  }
  
  const token = authHeader.replace("Bearer ", "");
  if (!token) {
    return res.status(401).send({ error: "Authentication required" });
  }

  try {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return res.status(500).send({ error: "JWT secret not configured" });
    }
    
    const decoded = jwt.verify(token, jwtSecret) as JwtPayload;
    req.user = decoded;
    next();
  } catch (e) {
    return res.status(401).send({ error: "Invalid auth token" });
  }
};

export default authMiddleware;
