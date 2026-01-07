import { AuthenticatedRequest } from "@/types";
import { Response } from "express";
import fs from "fs";
import path from "path";
const pdf = require("pdf-parse");
import textUtils from "../../utils/text";

const ROOT_DIR = path.resolve(__dirname, "../../../uploads");

export async function generateBookSummary(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    const { bookData } = req.body;

    if (!bookData || !bookData.bookUrl) {
      res.status(400).json({ error: "Book file is required" });
      return;
    }

    const filename = bookData.bookUrl;
    const filepath = path.join(ROOT_DIR, filename);

    if (!fs.existsSync(filepath)) {
      res.status(404).json({ error: "Book file not found" });
      return;
    }

    // Check extension
    const ext = path.extname(filename).toLowerCase();
    let textContent = "";

    if (ext === ".pdf") {
      try {
        const dataBuffer = fs.readFileSync(filepath);
        const data = await pdf(dataBuffer);
        textContent = data.text;
      } catch (pdfError) {
        console.error("Book PDF parsing critical failure:", pdfError);
        res.status(500).json({ error: "Failed to parse PDF book content." });
        return;
      }
    } else if (ext === ".txt") {
      textContent = fs.readFileSync(filepath, "utf-8");
    } else {
      res.status(400).json({ error: "Unsupported book format. Please use PDF or TXT." });
      return;
    }

    // Clean text
    const cleanText = textContent.replace(/\s+/g, " ").trim();

    if (cleanText.length < 50) {
      res.status(400).json({
        error: "Book content is insufficient or unreadable (scanned?).",
        details: `Extracted ${cleanText.length} chars.`
      });
      return;
    }

    // Generate summary
    // Books are long, so we might want to be smarter, but for now reuse text summary
    // Maybe take first 50k chars to avoid memory issues (simple truncation)
    const truncatedText = textContent.slice(0, 50000);
    const summary = textUtils.generateSummaryFromText(truncatedText);

    res.status(200).json({
      summary: summary || "Unable to generate summary from book content",
    });
  } catch (error) {
    console.error("Error generating Book summary:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
