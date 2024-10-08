const fs = require("fs");
const path = require("path");
const textUtils = require("../../utils/text");
const audioUtils = require("../../utils/audio");

const ROOT_DIR = "src/utils/audio/audios/";

const generateAudioSummary = async (req, res) => {
  try {
    const { audioData } = req.body;

    // check if valid audioData provided
    if (!audioData || !audioData.audioFileName || !audioData.format) {
      return res.status(400).json({ error: "Invalid audio data provided." });
    }

    // check if format is valid
    if (!["mp3", "wav"].includes(audioData.format)) {
      return res.status(400).json({ error: "Audio format not supported" });
    }

    // Check if the audio file exists
    if (!fs.existsSync(path.resolve(ROOT_DIR, audioData.audioFileName))) {
      return res.status(400).json({ error: "Audio file not found." });
    }

    // Convert audio to text asynchronously
    const textFromAudio = await audioUtils.convertAudioToText(
      audioData.audioFileName,
      audioData.format
    );

    if (!textFromAudio) {
      return res.status(400).json({ error: "No text found in the audio." });
    }

    // Generate summary from text
    const summary = textUtils.generateSummaryFromText(textFromAudio);

    res.status(200).json({ summary });
  } catch (error) {
    console.error("Error generating audio summary:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = generateAudioSummary;
