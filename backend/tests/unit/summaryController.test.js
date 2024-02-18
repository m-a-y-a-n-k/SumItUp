const fs = require("fs");
const chai = require("chai");
const { expect } = chai;
const sinon = require("sinon");
const summaryController = require("../../src/controllers/summary");

describe("Summary Controller - Audio Content", () => {
  describe("generateAudioSummary", () => {
    let req, res, next;

    beforeEach(() => {
      req = { body: {} };
      res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };
      next = sinon.spy();
    });

    afterEach(() => {
      fs.existsSync.restore();
    });

    it("should return error if invalid audio data provided", async () => {
      sinon.stub(fs, "existsSync").returns(true);
      await summaryController.generateAudioSummary(req, res);
      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith({ error: "Invalid audio data provided." })).to
        .be.true;
    });

    it("should return error if audio file not found", async () => {
      req.body.audioData = {
        audioFilePath: "invalid/path/to/audio.mp3",
        format: "mp3",
      };
      sinon.stub(fs, "existsSync").returns(false);
      await summaryController.generateAudioSummary(req, res);
      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith({ error: "Audio file not found." })).to.be
        .true;
    });

    it("should return error if audio format not supported", async () => {
      req.body.audioData = {
        audioFilePath: "valid/path/to/audio.mp3",
        format: "unsupported_format",
      };
      sinon.stub(fs, "existsSync").returns(true);
      await summaryController.generateAudioSummary(req, res);
      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith({ error: "Audio format not supported" })).to.be
        .true;
    });

    it("should return error if no text found in the audio", async () => {
      req.body.audioData = {
        audioFilePath: "src/utils/audio/audios/no-speech.mp3",
        format: "mp3",
      };
      sinon.stub(fs, "existsSync").returns(true);
      sinon.stub(summaryController, "convertAudioToText").resolves(null);
      await summaryController.generateAudioSummary(req, res);
      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith({ error: "No text found in the audio." })).to
        .be.true;
      summaryController.convertAudioToText.restore(); // Restore stub after the test
    });

    it("should generate summary from text", async () => {
      req.body.audioData = {
        audioFilePath: "valid/path/to/audio.mp3",
        format: "mp3",
      };
      sinon.stub(fs, "existsSync").returns(true);
      sinon
        .stub(summaryController, "convertAudioToText")
        .resolves("This is a sample text.");
      sinon
        .stub(summaryController, "generateSummaryFromText")
        .returns("Generated summary");
      await summaryController.generateAudioSummary(req, res);
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith({ summary: "Generated summary" })).to.be.true;
      summaryController.convertAudioToText.restore();
      summaryController.generateSummaryFromText.restore();
    });

    it("should handle internal server error", async () => {
      req.body.audioData = {
        audioFilePath: "valid/path/to/audio.mp3",
        format: "mp3",
      };
      sinon.stub(fs, "existsSync").returns(true);
      sinon
        .stub(summaryController, "convertAudioToText")
        .rejects(new Error("Internal server error"));
      await summaryController.generateAudioSummary(req, res);
      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({ error: "Internal Server Error" })).to.be
        .true;
      summaryController.convertAudioToText.restore();
    });
  });
});

describe("Summary Controller - Image Content", () => {
  describe("generateImageSummary", () => {
    it("should generate a summary for image content", async () => {
      // Test logic
    });

    // Add more tests for different scenarios related to image content
  });
});

describe("Summary Controller - Video Content", () => {
  describe("generateVideoSummary", () => {
    it("should generate a summary for video content", async () => {
      // Test logic
    });

    // Add more tests for different scenarios related to video content
  });
});

describe("Summary Controller - GIF Content", () => {
  describe("generateGifSummary", () => {
    it("should generate a summary for GIF content", async () => {
      // Test logic
    });

    // Add more tests for different scenarios related to GIF content
  });
});

describe("Summary Controller - URL Content", () => {
  describe("generateUrlSummary", () => {
    it("should generate a summary for URL content", async () => {
      // Test logic
    });

    // Add more tests for different scenarios related to URL content
  });
});

describe("Summary Controller - Book Content", () => {
  describe("generateBookSummary", () => {
    it("should generate a summary for Book content", async () => {
      // Test logic
    });

    // Add more tests for different scenarios related to URL content
  });
});

describe("Summary Controller - PDF Content", () => {
  describe("generatePDFSummary", () => {
    it("should generate a summary for PDF content", async () => {
      // Test logic
    });

    // Add more tests for different scenarios related to URL content
  });
});
