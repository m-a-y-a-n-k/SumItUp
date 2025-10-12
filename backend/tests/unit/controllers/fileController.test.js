const fs = require("fs");
const chai = require("chai");
const { expect } = chai;
const sinon = require("sinon");
const fileController = require("../../../src/controllers/file");

describe("File Controller", () => {
  let req, res;

  beforeEach(() => {
    req = {
      file: null,
      user: { id: "user123" },
      params: {},
      query: {}
    };
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
      setHeader: sinon.spy(),
      pipe: sinon.spy()
    };
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("uploadFile", () => {
    it("should return error if no file uploaded", async () => {
      await fileController.uploadFile(req, res);
      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith({ error: "No file uploaded" })).to.be.true;
    });

    it("should return error for unsupported file type", async () => {
      req.file = {
        originalname: "test.exe",
        mimetype: "application/x-executable",
        size: 1000,
        buffer: Buffer.from("test")
      };

      await fileController.uploadFile(req, res);
      expect(res.status.calledWith(400)).to.be.true;
      const response = res.json.getCall(0).args[0];
      expect(response.error).to.equal("File type not supported");
      expect(response).to.have.property('supportedTypes');
    });

    it("should return error for file too large", async () => {
      req.file = {
        originalname: "test.jpg",
        mimetype: "image/jpeg",
        size: 15 * 1024 * 1024, // 15MB
        buffer: Buffer.from("test")
      };

      await fileController.uploadFile(req, res);
      expect(res.status.calledWith(400)).to.be.true;
      const response = res.json.getCall(0).args[0];
      expect(response.error).to.include("File too large");
    });

    it("should successfully upload valid file", async () => {
      req.file = {
        originalname: "test.jpg",
        mimetype: "image/jpeg",
        size: 1000,
        buffer: Buffer.from("test image data")
      };

      // Mock fs operations
      sinon.stub(fs, "existsSync").returns(true);
      sinon.stub(fs, "mkdirSync");
      sinon.stub(fs, "writeFileSync");

      await fileController.uploadFile(req, res);
      expect(res.status.calledWith(200)).to.be.true;
      const response = res.json.getCall(0).args[0];
      expect(response.message).to.equal("File uploaded successfully");
      expect(response.file).to.have.property('id');
      expect(response.file).to.have.property('originalName');
      expect(response.file.originalName).to.equal('test.jpg');
    });

    it("should handle internal server error", async () => {
      req.file = {
        originalname: "test.jpg",
        mimetype: "image/jpeg",
        size: 1000,
        buffer: Buffer.from("test")
      };

      // Mock fs operations - first call succeeds, second throws error
      sinon.stub(fs, "existsSync").returns(true);
      sinon.stub(fs, "mkdirSync");
      sinon.stub(fs, "writeFileSync").throws(new Error("File system error"));

      await fileController.uploadFile(req, res);
      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({ error: "Internal Server Error" })).to.be.true;
    });
  });

  describe("downloadFile", () => {
    it("should return error if file ID is missing", async () => {
      await fileController.downloadFile(req, res);
      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith({ error: "File ID is required" })).to.be.true;
    });

    it("should return error if file not found", async () => {
      req.params.fileId = "nonexistent";
      sinon.stub(fs, "readdirSync").returns([]);

      await fileController.downloadFile(req, res);
      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWith({ error: "File not found" })).to.be.true;
    });

    it("should return error if file not found on disk", async () => {
      req.params.fileId = "test123";
      sinon.stub(fs, "readdirSync").returns(["test123.jpg"]);
      sinon.stub(fs, "existsSync").returns(false);

      await fileController.downloadFile(req, res);
      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWith({ error: "File not found on disk" })).to.be.true;
    });

    it("should successfully stream file", async () => {
      req.params.fileId = "test123";
      const mockStats = { size: 1000 };
      const mockStream = { pipe: sinon.spy() };

      sinon.stub(fs, "readdirSync").returns(["test123.jpg"]);
      sinon.stub(fs, "existsSync").returns(true);
      sinon.stub(fs, "statSync").returns(mockStats);
      sinon.stub(fs, "createReadStream").returns(mockStream);

      await fileController.downloadFile(req, res);
      expect(res.setHeader.calledWith('Content-Type')).to.be.true;
      expect(res.setHeader.calledWith('Content-Length', 1000)).to.be.true;
      expect(mockStream.pipe.calledWith(res)).to.be.true;
    });
  });

  describe("deleteFile", () => {
    it("should return error if file ID is missing", async () => {
      await fileController.deleteFile(req, res);
      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith({ error: "File ID is required" })).to.be.true;
    });

    it("should return error if file not found", async () => {
      req.params.fileId = "nonexistent";
      sinon.stub(fs, "readdirSync").returns([]);

      await fileController.deleteFile(req, res);
      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWith({ error: "File not found" })).to.be.true;
    });

    it("should successfully delete file", async () => {
      req.params.fileId = "test123";
      sinon.stub(fs, "readdirSync").returns(["test123.jpg"]);
      sinon.stub(fs, "existsSync").returns(true);
      sinon.stub(fs, "unlinkSync");

      await fileController.deleteFile(req, res);
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith({ message: "File deleted successfully" })).to.be.true;
    });
  });

  describe("listFiles", () => {
    it("should return paginated file list", async () => {
      req.query = { limit: "5", offset: "0" };
      const mockFiles = ["file1.jpg", "file2.pdf", "file3.mp3"];
      const mockStats = { size: 1000, birthtime: new Date(), mtime: new Date() };

      sinon.stub(fs, "readdirSync").returns(mockFiles);
      sinon.stub(fs, "statSync").returns(mockStats);

      await fileController.listFiles(req, res);
      expect(res.status.calledWith(200)).to.be.true;
      const response = res.json.getCall(0).args[0];
      expect(response).to.have.property('files');
      expect(response).to.have.property('total');
      expect(response.total).to.equal(3);
      expect(response.files).to.be.an('array');
    });

    it("should handle internal server error", async () => {
      sinon.stub(fs, "readdirSync").throws(new Error("Directory read error"));

      await fileController.listFiles(req, res);
      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({ error: "Internal Server Error" })).to.be.true;
    });
  });
});
