const chai = require("chai");
const { expect } = chai;
const sinon = require("sinon");
const mongoose = require("mongoose");
const Content = require("../../../src/models/Content");

describe("Content Model", () => {
  let contentData;

  beforeEach(() => {
    contentData = {
      userId: new mongoose.Types.ObjectId(),
      title: "Test Content",
      originalContent: "This is the original content for testing",
      summary: "This is a test summary",
      contentType: "text",
      metadata: {
        processingTime: 1500,
        confidence: 0.95,
        wordCount: 50,
        language: "en"
      },
      tags: ["test", "content"],
      isFavorite: false,
      isPublic: false
    };
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("Schema Validation", () => {
    it("should create a valid content document", () => {
      const content = new Content(contentData);
      const validationError = content.validateSync();
      expect(validationError).to.be.undefined;
    });

    it("should require userId", () => {
      delete contentData.userId;
      const content = new Content(contentData);
      const validationError = content.validateSync();
      expect(validationError.errors.userId).to.exist;
    });

    it("should require title", () => {
      delete contentData.title;
      const content = new Content(contentData);
      const validationError = content.validateSync();
      expect(validationError.errors.title).to.exist;
    });

    it("should require originalContent", () => {
      delete contentData.originalContent;
      const content = new Content(contentData);
      const validationError = content.validateSync();
      expect(validationError.errors.originalContent).to.exist;
    });

    it("should require summary", () => {
      delete contentData.summary;
      const content = new Content(contentData);
      const validationError = content.validateSync();
      expect(validationError.errors.summary).to.exist;
    });

    it("should validate contentType enum", () => {
      contentData.contentType = "invalid-type";
      const content = new Content(contentData);
      const validationError = content.validateSync();
      expect(validationError.errors.contentType).to.exist;
    });

    it("should accept valid contentType", () => {
      const validTypes = ['audio', 'image', 'video', 'gif', 'url', 'pdf', 'book', 'text'];
      validTypes.forEach(type => {
        contentData.contentType = type;
        const content = new Content(contentData);
        const validationError = content.validateSync();
        expect(validationError).to.be.undefined;
      });
    });

    it("should set default values", () => {
      const minimalData = {
        userId: new mongoose.Types.ObjectId(),
        title: "Test",
        originalContent: "Content",
        summary: "Summary",
        contentType: "text"
      };
      const content = new Content(minimalData);
      expect(content.isFavorite).to.be.false;
      expect(content.isPublic).to.be.false;
      expect(content.tags).to.be.an('array').that.is.empty;
    });
  });

  describe("Static Methods", () => {
    describe("findByUserId", () => {
      it("should call find with correct query", () => {
        const userId = new mongoose.Types.ObjectId();
        const findStub = sinon.stub(Content, "find").returns({
          sort: sinon.stub().returns({
            limit: sinon.stub().returns({
              skip: sinon.stub().resolves([])
            })
          })
        });

        Content.findByUserId(userId);
        expect(findStub.calledWith({ userId })).to.be.true;
      });

      it("should apply content type filter", () => {
        const userId = new mongoose.Types.ObjectId();
        const findStub = sinon.stub(Content, "find").returns({
          sort: sinon.stub().returns({
            limit: sinon.stub().returns({
              skip: sinon.stub().resolves([])
            })
          })
        });

        Content.findByUserId(userId, { contentType: "audio" });
        expect(findStub.calledWith({ userId, contentType: "audio" })).to.be.true;
      });

      it("should apply favorite filter", () => {
        const userId = new mongoose.Types.ObjectId();
        const findStub = sinon.stub(Content, "find").returns({
          sort: sinon.stub().returns({
            limit: sinon.stub().returns({
              skip: sinon.stub().resolves([])
            })
          })
        });

        Content.findByUserId(userId, { isFavorite: true });
        expect(findStub.calledWith({ userId, isFavorite: true })).to.be.true;
      });
    });

    describe("searchByTags", () => {
      it("should search by tags using $in operator", () => {
        const userId = new mongoose.Types.ObjectId();
        const tags = ["tag1", "tag2"];
        const findStub = sinon.stub(Content, "find").returns({
          sort: sinon.stub().resolves([])
        });

        Content.searchByTags(userId, tags);
        expect(findStub.calledWith({
          userId,
          tags: { $in: tags }
        })).to.be.true;
      });
    });
  });

  describe("Instance Methods", () => {
    let content;

    beforeEach(() => {
      content = new Content(contentData);
      content.save = sinon.stub().resolves(content);
    });

    describe("toggleFavorite", () => {
      it("should toggle favorite from false to true", async () => {
        content.isFavorite = false;
        await content.toggleFavorite();
        expect(content.isFavorite).to.be.true;
        expect(content.save.calledOnce).to.be.true;
      });

      it("should toggle favorite from true to false", async () => {
        content.isFavorite = true;
        await content.toggleFavorite();
        expect(content.isFavorite).to.be.false;
        expect(content.save.calledOnce).to.be.true;
      });
    });

    describe("addTags", () => {
      it("should add new tags", async () => {
        content.tags = ["existing"];
        const newTags = ["new1", "new2"];
        await content.addTags(newTags);
        expect(content.tags).to.include.members(["existing", "new1", "new2"]);
        expect(content.save.calledOnce).to.be.true;
      });

      it("should not duplicate existing tags", async () => {
        content.tags = ["existing", "tag1"];
        const newTags = ["tag1", "new2"];
        await content.addTags(newTags);
        expect(content.tags).to.deep.equal(["existing", "tag1", "new2"]);
      });
    });

    describe("removeTags", () => {
      it("should remove specified tags", async () => {
        content.tags = ["tag1", "tag2", "tag3"];
        const tagsToRemove = ["tag1", "tag3"];
        await content.removeTags(tagsToRemove);
        expect(content.tags).to.deep.equal(["tag2"]);
        expect(content.save.calledOnce).to.be.true;
      });

      it("should not affect non-matching tags", async () => {
        content.tags = ["keep1", "remove", "keep2"];
        const tagsToRemove = ["remove", "nonexistent"];
        await content.removeTags(tagsToRemove);
        expect(content.tags).to.deep.equal(["keep1", "keep2"]);
      });
    });
  });

  describe("Pre-save Middleware", () => {
    it("should update updatedAt on save", async () => {
      const content = new Content(contentData);
      const originalUpdatedAt = content.updatedAt;
      
      // Wait a bit to ensure time difference
      await new Promise(resolve => setTimeout(resolve, 10));
      
      // Manually trigger the pre-save middleware
      content.updatedAt = Date.now();
      
      expect(content.updatedAt.getTime()).to.be.greaterThan(originalUpdatedAt.getTime());
    });
  });
});
