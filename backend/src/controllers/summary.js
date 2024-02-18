const fs = require("fs");
const convertAudioToText = require("../utils/audio/convertAudioToText.js");
const generateSummaryFromText = require("../utils/generateSummaryFromText.js");

const summaryController = {
  generateSummaryFromText,
  convertAudioToText,
  generateAudioSummary: async (req, res) => {
    try {
      const { audioData } = req.body;

      // check if valid audioData provided
      if (!audioData || !audioData.audioFilePath || !audioData.format) {
        return res.status(400).json({ error: "Invalid audio data provided." });
      }

      // check if format is valid
      if (!["mp3", "wav"].includes(audioData.format)) {
        return res.status(400).json({ error: "Audio format not supported" });
      }

      // Check if the audio file exists
      if (!fs.existsSync(audioData.audioFilePath)) {
        return res.status(400).json({ error: "Audio file not found." });
      }

      // Convert audio to text asynchronously
      const textFromAudio = await summaryController.convertAudioToText(
        audioData.audioFilePath,
        audioData.format
      );

      if (!textFromAudio) {
        return res.status(400).json({ error: "No text found in the audio." });
      }

      // Generate summary from text
      const summary = summaryController.generateSummaryFromText(textFromAudio);

      res.status(200).json({ summary });
    } catch (error) {
      console.error("Error generating audio summary:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  generateImageSummary: async (req, res) => {
    // Implementation for generating image summary
  },

  generateVideoSummary: async (req, res) => {
    // Implementation for generating video summary
  },

  generateGifSummary: async (req, res) => {
    // Implementation for generating GIF summary
  },

  generateUrlSummary: async (req, res) => {
    // Implementation for generating URL summary
  },

  async generateBookSummary(req, res) {
    try {
      // Logic for generating book summary
      // This could include fetching book data from a database, processing it, and generating a summary

      // Placeholder logic for demonstration purposes
      const bookSummary = "Generated book summary";
      res.status(200).json({ summary: bookSummary });
    } catch (error) {
      console.error("Error generating book summary:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  async generatePDFSummary(req, res) {
    // Implementation for generating pdf summary
  },
};

module.exports = summaryController;
