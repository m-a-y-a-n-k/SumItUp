import { AuthenticatedRequest } from "@/types";
import { Response } from "express";
import axios from "axios";
import * as cheerio from "cheerio";
import textUtils from "../../utils/text";

export async function generateUrlSummary(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    const { url } = req.body;

    if (!url) {
      res.status(400).json({ error: "URL is required" });
      return;
    }

    // Basic URL validation
    const urlPattern = /^https?:\/\/.+/;
    if (!urlPattern.test(url)) {
      res.status(400).json({ error: "Invalid URL format" });
      return;
    }

    // Fetch the page content
    const response = await axios.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' }
    });
    const html = response.data;
    const $ = cheerio.load(html);

    // Remove script, style, and extraneous elements
    $('script').remove();
    $('style').remove();
    $('nav').remove();
    $('footer').remove();
    $('header').remove();

    // Extract text from paragraphs
    let textContent = "";
    $('p').each((i, el) => {
      textContent += $(el).text() + " ";
    });

    if (textContent.length < 50) {
      // Fallback to body text if paragraphs are missing
      textContent = $('body').text().replace(/\s+/g, ' ').trim();
    }

    if (textContent.length < 100) {
      res.status(400).json({ error: "The webpage provided has insufficient text content to summarize." });
      return;
    }

    // Generate summary
    const summary = textUtils.generateSummaryFromText(textContent);

    res.status(200).json({
      summary: summary || "Could not generate summary from content.",
    });
  } catch (error) {
    console.error("Error generating URL summary:", error);
    res.status(500).json({ error: "Failed to process URL. Ensure it is accessible." });
  }
}
