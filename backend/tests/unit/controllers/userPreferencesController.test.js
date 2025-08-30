const chai = require("chai");
const { expect } = chai;
const sinon = require("sinon");
const preferencesController = require("../../../src/controllers/user/preferences");
const UserPreferences = require("../../../src/models/UserPreferences");

describe("User Preferences Controller", () => {
  let req, res;

  beforeEach(() => {
    req = {
      user: { id: "user123" },
      body: {}
    };
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("getPreferences", () => {
    it("should return existing preferences", async () => {
      const mockPreferences = {
        defaultSummaryLength: "medium",
        summaryStyle: "paragraph",
        preferredLanguage: "en",
        processingQuality: "balanced",
        autoSaveContent: true,
        defaultPrivacy: "private",
        emailNotifications: true,
        processingNotifications: true,
        weeklyDigest: false,
        theme: "auto",
        itemsPerPage: 10,
        favoriteContentTypes: ["text", "audio"],
        interests: ["technology", "science"],
        updatedAt: new Date()
      };

      sinon.stub(UserPreferences, "findByUserId").resolves(mockPreferences);

      await preferencesController.getPreferences(req, res);
      expect(res.status.calledWith(200)).to.be.true;
      const response = res.json.getCall(0).args[0];
      expect(response.preferences).to.have.property('defaultSummaryLength');
      expect(response.preferences.defaultSummaryLength).to.equal('medium');
      expect(response.preferences.interests).to.include('technology');
    });

    it("should create default preferences if none exist", async () => {
      const mockDefaultPreferences = {
        defaultSummaryLength: "medium",
        summaryStyle: "paragraph",
        preferredLanguage: "en",
        processingQuality: "balanced",
        autoSaveContent: true,
        defaultPrivacy: "private",
        emailNotifications: true,
        processingNotifications: true,
        weeklyDigest: false,
        theme: "auto",
        itemsPerPage: 10,
        favoriteContentTypes: [],
        interests: [],
        updatedAt: new Date()
      };

      sinon.stub(UserPreferences, "findByUserId").resolves(null);
      sinon.stub(UserPreferences, "createDefault").resolves(mockDefaultPreferences);

      await preferencesController.getPreferences(req, res);
      expect(UserPreferences.createDefault.calledWith("user123")).to.be.true;
      expect(res.status.calledWith(200)).to.be.true;
    });

    it("should handle internal server error", async () => {
      sinon.stub(UserPreferences, "findByUserId").rejects(new Error("Database error"));

      await preferencesController.getPreferences(req, res);
      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({ error: "Internal Server Error" })).to.be.true;
    });
  });

  describe("updatePreferences", () => {
    it("should update existing preferences", async () => {
      req.body = {
        defaultSummaryLength: "long",
        theme: "dark",
        emailNotifications: false
      };

      const mockPreferences = {
        defaultSummaryLength: "medium",
        theme: "auto",
        emailNotifications: true,
        updatePreferences: sinon.stub().resolves(),
        updatedAt: new Date()
      };

      mockPreferences.updatePreferences.callsFake((updates) => {
        Object.assign(mockPreferences, updates);
        return Promise.resolve();
      });

      sinon.stub(UserPreferences, "findByUserId").resolves(mockPreferences);

      await preferencesController.updatePreferences(req, res);
      expect(res.status.calledWith(200)).to.be.true;
      const response = res.json.getCall(0).args[0];
      expect(response.message).to.equal("Preferences updated successfully");
      expect(mockPreferences.updatePreferences.calledWith(req.body)).to.be.true;
    });

    it("should create default preferences if none exist before updating", async () => {
      req.body = { theme: "dark" };

      const mockDefaultPreferences = {
        theme: "auto",
        updatePreferences: sinon.stub().resolves(),
        updatedAt: new Date()
      };

      sinon.stub(UserPreferences, "findByUserId").resolves(null);
      sinon.stub(UserPreferences, "createDefault").resolves(mockDefaultPreferences);

      await preferencesController.updatePreferences(req, res);
      expect(UserPreferences.createDefault.calledWith("user123")).to.be.true;
      expect(mockDefaultPreferences.updatePreferences.calledWith(req.body)).to.be.true;
    });
  });

  describe("resetPreferences", () => {
    it("should reset preferences to default", async () => {
      const mockDefaultPreferences = {
        defaultSummaryLength: "medium",
        theme: "auto",
        updatedAt: new Date()
      };

      sinon.stub(UserPreferences, "deleteOne").resolves();
      sinon.stub(UserPreferences, "createDefault").resolves(mockDefaultPreferences);

      await preferencesController.resetPreferences(req, res);
      expect(UserPreferences.deleteOne.calledWith({ userId: "user123" })).to.be.true;
      expect(UserPreferences.createDefault.calledWith("user123")).to.be.true;
      expect(res.status.calledWith(200)).to.be.true;
      const response = res.json.getCall(0).args[0];
      expect(response.message).to.equal("Preferences reset to default successfully");
    });
  });

  describe("addInterests", () => {
    it("should add new interests", async () => {
      req.body.interests = ["machine-learning", "ai"];

      const mockPreferences = {
        interests: ["technology"],
        save: sinon.stub().resolves()
      };

      sinon.stub(UserPreferences, "findByUserId").resolves(mockPreferences);

      await preferencesController.addInterests(req, res);
      expect(res.status.calledWith(200)).to.be.true;
      const response = res.json.getCall(0).args[0];
      expect(response.message).to.equal("Interests added successfully");
      expect(mockPreferences.interests).to.include("machine-learning");
      expect(mockPreferences.interests).to.include("technology"); // existing interest preserved
    });

    it("should return error if interests is not an array", async () => {
      req.body.interests = "not-an-array";

      await preferencesController.addInterests(req, res);
      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith({ error: "Interests must be an array" })).to.be.true;
    });

    it("should create default preferences if none exist", async () => {
      req.body.interests = ["new-interest"];

      const mockDefaultPreferences = {
        interests: [],
        save: sinon.stub().resolves()
      };

      sinon.stub(UserPreferences, "findByUserId").resolves(null);
      sinon.stub(UserPreferences, "createDefault").resolves(mockDefaultPreferences);

      await preferencesController.addInterests(req, res);
      expect(UserPreferences.createDefault.calledWith("user123")).to.be.true;
    });
  });

  describe("removeInterests", () => {
    it("should remove specified interests", async () => {
      req.body.interests = ["old-interest"];

      const mockPreferences = {
        interests: ["technology", "old-interest", "science"],
        save: sinon.stub().resolves()
      };

      sinon.stub(UserPreferences, "findByUserId").resolves(mockPreferences);

      await preferencesController.removeInterests(req, res);
      expect(res.status.calledWith(200)).to.be.true;
      const response = res.json.getCall(0).args[0];
      expect(response.message).to.equal("Interests removed successfully");
      expect(mockPreferences.interests).to.not.include("old-interest");
      expect(mockPreferences.interests).to.include("technology"); // other interests preserved
    });

    it("should return error if interests is not an array", async () => {
      req.body.interests = "not-an-array";

      await preferencesController.removeInterests(req, res);
      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith({ error: "Interests must be an array" })).to.be.true;
    });

    it("should return error if preferences not found", async () => {
      req.body.interests = ["some-interest"];
      sinon.stub(UserPreferences, "findByUserId").resolves(null);

      await preferencesController.removeInterests(req, res);
      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWith({ error: "Preferences not found" })).to.be.true;
    });
  });
});
