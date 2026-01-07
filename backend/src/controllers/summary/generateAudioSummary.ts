import fs from "fs";
import path from "path";
import textUtils from "../../utils/text";
import audioUtils from "../../utils/audio";
import { AuthenticatedRequest } from "@/types";
import { Response } from "express";

const ROOT_DIR = path.resolve(__dirname, "../../../uploads");
const LEGACY_DIR = "src/utils/audio/audios/";

export async function generateAudioSummary(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { audioData } = req.body;

    // check if valid audioData provided
    if (!audioData || !audioData.audioFileName || !audioData.format) {
      res.status(400).json({ error: "Invalid audio data provided." });
      return;
    }

    // check if format is valid
    if (!["mp3", "wav"].includes(audioData.format)) {
      res.status(400).json({ error: "Audio format not supported" });
      return;
    }

    // Check if the audio file exists
    let filePath = path.resolve(ROOT_DIR, audioData.audioFileName);
    if (!fs.existsSync(filePath)) {
      // Try legacy path
      filePath = path.resolve(LEGACY_DIR, audioData.audioFileName);
      if (!fs.existsSync(filePath)) {
        res.status(400).json({ error: "Audio file not found." });
        return;
      }
    }

    // Convert audio to text asynchronously
    const textFromAudio = await audioUtils.convertAudioToText(
      filePath,
      audioData.format
    );

    if (!textFromAudio) {
      res.status(400).json({ error: "No text found in the audio." });
      return;
    }

    // Generate summary from text
    const summary = textUtils.generateSummaryFromText(textFromAudio);

    res.status(200).json({ summary });
  } catch (error) {
    console.error("Error generating audio summary:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default generateAudioSummary;
