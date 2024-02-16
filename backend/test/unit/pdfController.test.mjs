// test/unit/pdfController.test.mjs
import { expect } from "chai";
import sinon from "sinon";
import pdfController from "../../src/controllers/pdfController.mjs";

describe("PDF Controller", () => {
  describe("generatePDF", () => {
    it("should generate a PDF document", async () => {
      // Mock request and response objects
      const req = {};
      const res = {
        status: sinon.stub().returnsThis(),
        send: sinon.spy(),
      };

      // Call the controller method
      await pdfController.generatePDF(req, res);

      // Assertions
      expect(res.status.calledOnceWith(200)).to.be.true;
      expect(res.send.calledOnceWith("Generated PDF content")).to.be.true;
    });

    it("should handle errors", async () => {
      // Mock request and response objects
      const req = {};
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };

      // Stub console.error to prevent error message output during test
      const consoleErrorStub = sinon.stub(console, "error");

      // Force an error to be thrown inside the controller method
      sinon.stub(pdfController, "generatePDF").throws(new Error("Test error"));

      // Call the controller method
      await pdfController.generatePDF(req, res);

      // Assertions
      expect(res.status.calledOnceWith(500)).to.be.true;
      expect(res.json.calledOnceWith({ error: "Internal Server Error" })).to.be
        .true;

      // Restore the original console.error and controller method
      consoleErrorStub.restore();
      pdfController.generatePDF.restore();
    });
  });
});
