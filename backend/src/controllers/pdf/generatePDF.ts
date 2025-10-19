import { AuthenticatedRequest } from "@/types";
import PDFService from "../../services/pdf/generate";
import { Response } from "express";

export async function generatePDF(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { summary } = req.body;
    if (!summary || summary.trim() === "") {
      res.status(400).json({
        success: false,
        message: "Summary cannot be empty",
      });
      return;
    }
    const pdfPath = await PDFService.createPDFFile(summary);
    res.status(200).json({ success: true, pdfPath });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to generate PDF",
    });
  }
}