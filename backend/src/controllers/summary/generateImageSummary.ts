import imageService from "../../services/summary/image";
import { AuthenticatedRequest } from "@/types";
import { Response } from "express";

export async function generateImageSummary(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const imageData = req.body.imageData; // Assuming image data is sent in the request body
    const summary = await imageService.generateSummaryFromImage(imageData);
    res.status(200).json({ summary });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}