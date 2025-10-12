import { Request, Response } from "express";

// Logout method
const logout = (req: Request, res: Response): Response => {
  // For JWT-based auth, logout is handled client-side by removing the token
  // If using sessions, you would call req.logout() here
  return res.status(200).send({ message: "Logout successful" });
};

export default logout;
