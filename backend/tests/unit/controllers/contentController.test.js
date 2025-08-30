const chai = require("chai");
const { expect } = chai;
const sinon = require("sinon");
const contentController = require("../../../src/controllers/content");
const Content = require("../../../src/models/Content");

describe("Content Controller", () => {
  let req, res;

  beforeEach(() => {
    req = {
      user: { id: "user123" },
      body: {},
      params: {},
      query: {}
    };
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("saveContent", () => {
    it("should return error if required fields are missing", async () => {
      await contentController.saveContent(req, res);
      expect(res.status.calledWith(400)).to.be.true;
      const response = res.json.getCall(0).args[0];
      expect(response.error).to.include("Title, original content, summary, and content type are required");
    });

    it("should successfully save content", async () => {
      req.body = {
        title: "Test Content",
        originalContent: "Original text content",
        summary: "Test summary",
        contentType: "text",
        metadata: { wordCount: 100 },
        tags: ["test", "content"]
      };

      const mockContent = {
        _id: "content123",
        title: "Test Content",
        contentType: "text",
        createdAt: new Date(),
        isFavorite: false,
        save: sinon.stub().resolves()
      };

      sinon.stub(Content.prototype, "save").resolves();
      sinon.stub(Content.prototype, "constructor").returns(mockContent);

      // Mock the Content constructor
      const ContentStub = sinon.stub().returns(mockContent);
      ContentStub.prototype.save = sinon.stub().resolves();

      await contentController.saveContent(req, res);
      expect(res.status.calledWith(201)).to.be.true;
      const response = res.json.getCall(0).args[0];
      expect(response.message).to.equal("Content saved successfully");
    });

    it("should handle internal server error", async () => {
      req.body = {
        title: "Test Content",
        originalContent: "Original text content",
        summary: "Test summary",
        contentType: "text"
      };

      sinon.stub(Content.prototype, "save").rejects(new Error("Database error"));

      await contentController.saveContent(req, res);
      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({ error: "Internal Server Error" })).to.be.true;
    });
  });

  describe("getHistory", () => {
    it("should return paginated content history", async () => {
      req.query = { limit: "10", offset: "0" };

      const mockContents = [
        {
          _id: "content1",
          title: "Content 1",
          summary: "Summary 1",
          contentType: "text",
          tags: ["tag1"],
          isFavorite: false,
          createdAt: new Date(),
          metadata: {}
        }
      ];

      sinon.stub(Content, "findByUserId").resolves(mockContents);
      sinon.stub(Content, "countDocuments").resolves(1);

      await contentController.getHistory(req, res);
      expect(res.status.calledWith(200)).to.be.true;
      const response = res.json.getCall(0).args[0];
      expect(response).to.have.property('contents');
      expect(response).to.have.property('pagination');
      expect(response.contents).to.be.an('array');
      expect(response.pagination.total).to.equal(1);
    });

    it("should handle filtering by content type", async () => {
      req.query = { contentType: "audio", limit: "10", offset: "0" };

      sinon.stub(Content, "findByUserId").resolves([]);
      sinon.stub(Content, "countDocuments").resolves(0);

      await contentController.getHistory(req, res);
      expect(Content.findByUserId.calledWith("user123", {
        limit: 10,
        offset: 0,
        contentType: "audio"
      })).to.be.true;
    });
  });

  describe("getContent", () => {
    it("should return specific content", async () => {
      req.params.contentId = "content123";

      const mockContent = {
        _id: "content123",
        title: "Test Content",
        originalContent: "Original content",
        summary: "Test summary",
        contentType: "text",
        tags: ["test"],
        isFavorite: false,
        isPublic: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        metadata: {}
      };

      sinon.stub(Content, "findOne").resolves(mockContent);

      await contentController.getContent(req, res);
      expect(res.status.calledWith(200)).to.be.true;
      const response = res.json.getCall(0).args[0];
      expect(response.content).to.have.property('id');
      expect(response.content.title).to.equal('Test Content');
    });

    it("should return error if content not found", async () => {
      req.params.contentId = "nonexistent";
      sinon.stub(Content, "findOne").resolves(null);

      await contentController.getContent(req, res);
      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWith({ error: "Content not found" })).to.be.true;
    });
  });

  describe("toggleFavorite", () => {
    it("should toggle favorite status", async () => {
      req.params.contentId = "content123";

      const mockContent = {
        _id: "content123",
        isFavorite: false,
        toggleFavorite: sinon.stub().resolves()
      };
      mockContent.toggleFavorite.callsFake(() => {
        mockContent.isFavorite = true;
        return Promise.resolve();
      });

      sinon.stub(Content, "findOne").resolves(mockContent);

      await contentController.toggleFavorite(req, res);
      expect(res.status.calledWith(200)).to.be.true;
      const response = res.json.getCall(0).args[0];
      expect(response.message).to.include("added to");
      expect(response.isFavorite).to.be.true;
    });

    it("should return error if content not found", async () => {
      req.params.contentId = "nonexistent";
      sinon.stub(Content, "findOne").resolves(null);

      await contentController.toggleFavorite(req, res);
      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWith({ error: "Content not found" })).to.be.true;
    });
  });

  describe("addTags", () => {
    it("should add tags to content", async () => {
      req.params.contentId = "content123";
      req.body.tags = ["new-tag", "another-tag"];

      const mockContent = {
        _id: "content123",
        tags: ["existing-tag"],
        addTags: sinon.stub().resolves()
      };
      mockContent.addTags.callsFake((newTags) => {
        mockContent.tags = [...mockContent.tags, ...newTags];
        return Promise.resolve();
      });

      sinon.stub(Content, "findOne").resolves(mockContent);

      await contentController.addTags(req, res);
      expect(res.status.calledWith(200)).to.be.true;
      const response = res.json.getCall(0).args[0];
      expect(response.message).to.equal("Tags added successfully");
      expect(response.tags).to.include("new-tag");
    });

    it("should return error if tags is not an array", async () => {
      req.params.contentId = "content123";
      req.body.tags = "not-an-array";

      await contentController.addTags(req, res);
      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith({ error: "Tags must be an array" })).to.be.true;
    });
  });

  describe("deleteContent", () => {
    it("should successfully delete content", async () => {
      req.params.contentId = "content123";
      sinon.stub(Content, "deleteOne").resolves({ deletedCount: 1 });

      await contentController.deleteContent(req, res);
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith({ message: "Content deleted successfully" })).to.be.true;
    });

    it("should return error if content not found", async () => {
      req.params.contentId = "nonexistent";
      sinon.stub(Content, "deleteOne").resolves({ deletedCount: 0 });

      await contentController.deleteContent(req, res);
      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWith({ error: "Content not found" })).to.be.true;
    });
  });

  describe("searchByTags", () => {
    it("should search content by tags", async () => {
      req.query.tags = "tag1,tag2";

      const mockContents = [
        {
          _id: "content1",
          title: "Content 1",
          summary: "Summary 1",
          contentType: "text",
          tags: ["tag1", "tag2"],
          isFavorite: false,
          createdAt: new Date()
        }
      ];

      sinon.stub(Content, "searchByTags").resolves(mockContents);

      await contentController.searchByTags(req, res);
      expect(res.status.calledWith(200)).to.be.true;
      const response = res.json.getCall(0).args[0];
      expect(response.searchTags).to.deep.equal(["tag1", "tag2"]);
      expect(response.contents).to.be.an('array');
      expect(response.total).to.equal(1);
    });

    it("should return error if tags parameter is missing", async () => {
      await contentController.searchByTags(req, res);
      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith({ error: "Tags parameter is required" })).to.be.true;
    });
  });
});
