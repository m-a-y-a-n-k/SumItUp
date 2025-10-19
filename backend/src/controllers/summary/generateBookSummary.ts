import { AuthenticatedRequest } from "@/types";
import { Response } from "express";

export async function generateBookSummary(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    const bookSummary = `Generated book summary for ${req.body.book}`;
    res.status(200).json({ summary: bookSummary });
  } catch (error) {
    console.error("Error generating book summary:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
