const fs = require("fs");
const chai = require("chai");
const { expect } = chai;
const sinon = require("sinon");
const summaryController = require("../../../src/controllers/summary");
const imageService = require("../../../src/services/summary/image");
const audioUtils = require("../../../src/utils/audio");
const textUtils = require("../../../src/utils/text");

describe("Summary Controller - Audio Content", () => {
  describe("generateAudioSummary", () => {
    let req, res;

    beforeEach(() => {
      req = { body: {} };
      res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };
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
        audioFileName: "invalid/path/to/audio.mp3",
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
        audioFileName: "valid/path/to/audio.mp3",
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
        audioFileName: "no-speech.mp3",
        format: "mp3",
      };
      sinon.stub(fs, "existsSync").returns(true);
      sinon.stub(audioUtils, "convertAudioToText").resolves(null);
      await summaryController.generateAudioSummary(req, res);
      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith({ error: "No text found in the audio." })).to
        .be.true;
      audioUtils.convertAudioToText.restore(); // Restore stub after the test
    });

    it("should generate summary from text", async () => {
      req.body.audioData = {
        audioFileName: "valid/path/to/audio.mp3",
        format: "mp3",
      };
      sinon.stub(fs, "existsSync").returns(true);
      sinon
        .stub(audioUtils, "convertAudioToText")
        .resolves("This is a sample text.");
      sinon
        .stub(textUtils, "generateSummaryFromText")
        .returns("Generated summary");
      await summaryController.generateAudioSummary(req, res);
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith({ summary: "Generated summary" })).to.be.true;
      audioUtils.convertAudioToText.restore();
      textUtils.generateSummaryFromText.restore();
    });

    it("should handle internal server error", async () => {
      req.body.audioData = {
        audioFileName: "valid/path/to/audio.mp3",
        format: "mp3",
      };
      sinon.stub(fs, "existsSync").returns(true);
      sinon
        .stub(audioUtils, "convertAudioToText")
        .rejects(new Error("Internal server error"));
      await summaryController.generateAudioSummary(req, res);
      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({ error: "Internal Server Error" })).to.be
        .true;
      audioUtils.convertAudioToText.restore();
    });
  });
});

describe("Summary Controller - Image Content", () => {
  describe("generateImageSummary", () => {
    it("should generate a summary from image data and return 200 status code", async () => {
      // Mock request and response objects
      const req = { body: { imageData: "mockImageData" } };
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

      // Mock the imageService function
      const mockSummary = "Generated summary";
      sinon
        .stub(imageService, "generateSummaryFromImage")
        .resolves(mockSummary);

      // Call the controller method
      await summaryController.generateImageSummary(req, res);

      // Verify the response
      expect(res.status.calledOnceWith(200)).to.be.true;
      expect(res.json.calledOnceWith({ summary: mockSummary })).to.be.true;

      // Restore the stubs
      sinon.restore();
    });

    it("should handle errors and return 500 status code with error message", async () => {
      // Mock request and response objects
      const req = { body: { imageData: "mockImageData" } };
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

      // Mock the imageService function to throw an error
      const errorMessage = "Failed to generate summary";
      sinon
        .stub(imageService, "generateSummaryFromImage")
        .throws(new Error(errorMessage));

      // Call the controller method
      await summaryController.generateImageSummary(req, res);

      // Verify the response
      expect(res.status.calledOnceWith(500)).to.be.true;
      expect(res.json.calledOnceWith({ error: errorMessage })).to.be.true;

      // Restore the stubs
      sinon.restore();
    });
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
