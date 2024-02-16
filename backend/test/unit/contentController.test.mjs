// test/contentController.test.mjs
import { expect } from "chai";
import sinon from "sinon";
import contentController from "../../src/controllers/contentController.mjs";

describe("Content Controller", () => {
  describe("uploadAudio", () => {
    it("should upload audio content", async () => {
      // Mock request and response objects
      const req = {};
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };

      // Call the controller method
      await contentController.uploadAudio(req, res);

      // Assertions
      expect(res.status.calledOnceWith(200)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
    });
  });

  describe("uploadImage", () => {
    it("should upload image content", async () => {
      // Mock request and response objects
      const req = {};
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };

      // Call the controller method
      await contentController.uploadImage(req, res);

      // Assertions
      expect(res.status.calledOnceWith(200)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
    });
  });

  describe("uploadVideo", () => {
    it("should upload video content", async () => {
      // Mock request and response objects
      const req = {};
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };

      // Call the controller method
      await contentController.uploadVideo(req, res);

      // Assertions
      expect(res.status.calledOnceWith(200)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
    });
  });

  describe("uploadGif", () => {
    it("should upload GIF content", async () => {
      // Mock request and response objects
      const req = {};
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };

      // Call the controller method
      await contentController.uploadGif(req, res);

      // Assertions
      expect(res.status.calledOnceWith(200)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
    });
  });
});
