const chai = require("chai");
const sinon = require("sinon");
const fs = require("fs");
const PDFService = require("../../../src/services/pdf/generate");
const chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);
const { expect } = chai;

describe("PDFService", () => {
  let writeStreamStub;

  beforeEach(() => {
    writeStreamStub = {
      write: sinon.stub(),
      end: sinon.stub(),
      on: sinon.stub(),
      once: sinon.stub(),
      emit: sinon.stub(),
    };
    writeStreamStub.on.withArgs("finish").callsFake((callback) => callback());

    sinon.stub(fs, "createWriteStream").returns(writeStreamStub);
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should generate a PDF and return the file path", async () => {
    const summary = "This is a test summary";
    const pdfPath = await PDFService.generatePDF(summary);

    expect(pdfPath).to.match(/\/pdfs\/summary_\d+\.pdf/);
    expect(fs.createWriteStream.calledOnce).to.be.true;
  });

  it("should throw an error if the summary is empty", async () => {
    await expect(PDFService.generatePDF("")).to.be.rejectedWith(
      "Summary is empty"
    );
    await expect(PDFService.generatePDF("   ")).to.be.rejectedWith(
      "Summary is empty"
    );
  });
});
