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
    let req, res;

    beforeEach(() => {
      req = { body: {} };
      res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };
    });

    it("should return error if video URL is missing", async () => {
      await summaryController.generateVideoSummary(req, res);
      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith({ error: "Video URL is required" })).to.be.true;
    });

    it("should return placeholder summary for valid video URL", async () => {
      req.body.videoData = { videoUrl: "https://example.com/video.mp4" };
      await summaryController.generateVideoSummary(req, res);
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      const response = res.json.getCall(0).args[0];
      expect(response).to.have.property('summary');
      expect(response).to.have.property('message');
      expect(response.summary).to.include('Video summary for https://example.com/video.mp4');
    });

    it("should handle internal server error", async () => {
      // Simulate an error by passing invalid data that causes an exception
      req.body = null;
      await summaryController.generateVideoSummary(req, res);
      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({ error: "Internal Server Error" })).to.be.true;
    });
  });
});

describe("Summary Controller - GIF Content", () => {
  describe("generateGifSummary", () => {
    let req, res;

    beforeEach(() => {
      req = { body: {} };
      res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };
    });

    it("should return error if GIF URL is missing", async () => {
      await summaryController.generateGifSummary(req, res);
      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith({ error: "GIF URL is required" })).to.be.true;
    });

    it("should return placeholder summary for valid GIF URL", async () => {
      req.body.gifData = { gifUrl: "https://example.com/animation.gif" };
      await summaryController.generateGifSummary(req, res);
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      const response = res.json.getCall(0).args[0];
      expect(response).to.have.property('summary');
      expect(response).to.have.property('message');
      expect(response.summary).to.include('GIF summary for https://example.com/animation.gif');
    });

    it("should handle internal server error", async () => {
      req.body = null;
      await summaryController.generateGifSummary(req, res);
      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({ error: "Internal Server Error" })).to.be.true;
    });
  });
});

describe("Summary Controller - URL Content", () => {
  describe("generateUrlSummary", () => {
    let req, res;

    beforeEach(() => {
      req = { body: {} };
      res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };
    });

    it("should return error if URL is missing", async () => {
      await summaryController.generateUrlSummary(req, res);
      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith({ error: "URL is required" })).to.be.true;
    });

    it("should return error for invalid URL format", async () => {
      req.body.url = "invalid-url";
      await summaryController.generateUrlSummary(req, res);
      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith({ error: "Invalid URL format" })).to.be.true;
    });

    it("should return placeholder summary for valid URL", async () => {
      req.body.url = "https://example.com/article";
      await summaryController.generateUrlSummary(req, res);
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      const response = res.json.getCall(0).args[0];
      expect(response).to.have.property('summary');
      expect(response).to.have.property('message');
      expect(response.summary).to.include('URL summary for https://example.com/article');
    });

    it("should handle internal server error", async () => {
      req.body = null;
      await summaryController.generateUrlSummary(req, res);
      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({ error: "Internal Server Error" })).to.be.true;
    });
  });
});

describe("Summary Controller - Book Content", () => {
  describe("generateBookSummary", () => {
    let req, res;

    beforeEach(() => {
      req = { body: {} };
      res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };
    });

    it("should generate a summary for Book content", async () => {
      req.body.book = "Sample Book Title";
      await summaryController.generateBookSummary(req, res);
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      const response = res.json.getCall(0).args[0];
      expect(response).to.have.property('summary');
      expect(response.summary).to.include('Generated book summary for Sample Book Title');
    });

    it("should handle internal server error", async () => {
      req.body = null;
      await summaryController.generateBookSummary(req, res);
      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({ error: "Internal Server Error" })).to.be.true;
    });
  });
});

describe("Summary Controller - PDF Content", () => {
  describe("generatePDFSummary", () => {
    let req, res;

    beforeEach(() => {
      req = { body: {} };
      res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };
    });

    afterEach(() => {
      sinon.restore();
    });

    it("should return error if PDF data is missing", async () => {
      await summaryController.generatePDFSummary(req, res);
      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith({ error: "PDF URL or text content is required" })).to.be.true;
    });

    it("should generate summary from provided text", async () => {
      req.body.pdfData = { pdfText: "This is sample PDF text content." };
      sinon.stub(textUtils, "generateSummaryFromText").returns("Generated PDF summary");
      
      await summaryController.generatePDFSummary(req, res);
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      const response = res.json.getCall(0).args[0];
      expect(response).to.have.property('summary');
      expect(response.summary).to.equal('Generated PDF summary');
    });

    it("should return placeholder for PDF URL", async () => {
      req.body.pdfData = { pdfUrl: "https://example.com/document.pdf" };
      sinon.stub(textUtils, "generateSummaryFromText").returns("Generated summary");
      
      await summaryController.generatePDFSummary(req, res);
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      const response = res.json.getCall(0).args[0];
      expect(response).to.have.property('summary');
      expect(response).to.have.property('message');
    });

    it("should handle internal server error", async () => {
      req.body = null;
      await summaryController.generatePDFSummary(req, res);
      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({ error: "Internal Server Error" })).to.be.true;
    });
  });
});
