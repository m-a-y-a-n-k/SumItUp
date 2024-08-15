const express = require("express");
const request = require("supertest");
const chai = require("chai");
const sinon = require("sinon");
const pdfController = require("../../../src/controllers/pdf");
const PDFService = require("../../../src/services/pdf/generate");
const chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);
const { expect } = chai;

const app = express();
app.use(express.json());
app.post("/pdf/generate", pdfController.generatePDF);

describe("PDFController", () => {
  let generatePDFStub;

  beforeEach(() => {
    generatePDFStub = sinon.stub(PDFService, "createPDFFile");
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should return 400 if the summary is empty", async () => {
    const response = await request(app)
      .post("/pdf/generate")
      .send({ summary: "" });
    expect(response.status).to.equal(400);
    expect(response.body.message).to.equal("Summary cannot be empty");

    const response2 = await request(app)
      .post("/pdf/generate")
      .send({ summary: "   " });
    expect(response2.status).to.equal(400);
    expect(response2.body.message).to.equal("Summary cannot be empty");
  });

  it("should return 200 and the PDF path if the summary is valid", async () => {
    generatePDFStub.resolves("/pdfs/summary_12345.pdf");
    const response = await request(app)
      .post("/pdf/generate")
      .send({ summary: "Valid summary" });

    expect(response.status).to.equal(200);
    expect(response.body.success).to.be.true;
    expect(response.body.pdfPath).to.equal("/pdfs/summary_12345.pdf");
  });

  it("should return 500 if an error occurs during PDF generation", async () => {
    generatePDFStub.rejects(new Error("Failed to generate PDF"));
    const response = await request(app)
      .post("/pdf/generate")
      .send({ summary: "Valid summary" });

    expect(response.status).to.equal(500);
    expect(response.body.success).to.be.false;
    expect(response.body.message).to.equal("Failed to generate PDF");
  });
});
