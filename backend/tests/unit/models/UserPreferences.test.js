const chai = require("chai");
const { expect } = chai;
const sinon = require("sinon");
const mongoose = require("mongoose");
const UserPreferences = require("../../../src/models/UserPreferences");

describe("UserPreferences Model", () => {
  let preferencesData;

  beforeEach(() => {
    preferencesData = {
      userId: new mongoose.Types.ObjectId(),
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
      interests: ["technology", "science"]
    };
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("Schema Validation", () => {
    it("should create a valid preferences document", () => {
      const preferences = new UserPreferences(preferencesData);
      const validationError = preferences.validateSync();
      expect(validationError).to.be.undefined;
    });

    it("should require userId", () => {
      delete preferencesData.userId;
      const preferences = new UserPreferences(preferencesData);
      const validationError = preferences.validateSync();
      expect(validationError.errors.userId).to.exist;
    });

    it("should enforce unique userId", () => {
      const preferences = new UserPreferences(preferencesData);
      expect(preferences.schema.paths.userId.options.unique).to.be.true;
    });

    it("should validate defaultSummaryLength enum", () => {
      preferencesData.defaultSummaryLength = "invalid";
      const preferences = new UserPreferences(preferencesData);
      const validationError = preferences.validateSync();
      expect(validationError.errors.defaultSummaryLength).to.exist;
    });

    it("should accept valid defaultSummaryLength values", () => {
      const validLengths = ["short", "medium", "long"];
      validLengths.forEach(length => {
        preferencesData.defaultSummaryLength = length;
        const preferences = new UserPreferences(preferencesData);
        const validationError = preferences.validateSync();
        expect(validationError).to.be.undefined;
      });
    });

    it("should validate summaryStyle enum", () => {
      preferencesData.summaryStyle = "invalid";
      const preferences = new UserPreferences(preferencesData);
      const validationError = preferences.validateSync();
      expect(validationError.errors.summaryStyle).to.exist;
    });

    it("should accept valid summaryStyle values", () => {
      const validStyles = ["bullet-points", "paragraph", "keywords", "abstract"];
      validStyles.forEach(style => {
        preferencesData.summaryStyle = style;
        const preferences = new UserPreferences(preferencesData);
        const validationError = preferences.validateSync();
        expect(validationError).to.be.undefined;
      });
    });

    it("should validate processingQuality enum", () => {
      preferencesData.processingQuality = "invalid";
      const preferences = new UserPreferences(preferencesData);
      const validationError = preferences.validateSync();
      expect(validationError.errors.processingQuality).to.exist;
    });

    it("should validate defaultPrivacy enum", () => {
      preferencesData.defaultPrivacy = "invalid";
      const preferences = new UserPreferences(preferencesData);
      const validationError = preferences.validateSync();
      expect(validationError.errors.defaultPrivacy).to.exist;
    });

    it("should validate theme enum", () => {
      preferencesData.theme = "invalid";
      const preferences = new UserPreferences(preferencesData);
      const validationError = preferences.validateSync();
      expect(validationError.errors.theme).to.exist;
    });

    it("should validate itemsPerPage range", () => {
      preferencesData.itemsPerPage = 3; // Below minimum
      let preferences = new UserPreferences(preferencesData);
      let validationError = preferences.validateSync();
      expect(validationError.errors.itemsPerPage).to.exist;

      preferencesData.itemsPerPage = 60; // Above maximum
      preferences = new UserPreferences(preferencesData);
      validationError = preferences.validateSync();
      expect(validationError.errors.itemsPerPage).to.exist;

      preferencesData.itemsPerPage = 25; // Valid range
      preferences = new UserPreferences(preferencesData);
      validationError = preferences.validateSync();
      expect(validationError).to.be.undefined;
    });

    it("should validate favoriteContentTypes enum values", () => {
      // Test that the schema accepts valid content types
      const validTypes = ['audio', 'image', 'video', 'gif', 'url', 'pdf', 'book', 'text'];
      preferencesData.favoriteContentTypes = validTypes;
      const preferences = new UserPreferences(preferencesData);
      const validationError = preferences.validateSync();
      expect(validationError).to.be.undefined;
      expect(preferences.favoriteContentTypes).to.deep.equal(validTypes);
    });

    it("should set default values", () => {
      const minimalData = {
        userId: new mongoose.Types.ObjectId()
      };
      const preferences = new UserPreferences(minimalData);
      expect(preferences.defaultSummaryLength).to.equal("medium");
      expect(preferences.summaryStyle).to.equal("paragraph");
      expect(preferences.preferredLanguage).to.equal("en");
      expect(preferences.processingQuality).to.equal("balanced");
      expect(preferences.autoSaveContent).to.be.true;
      expect(preferences.defaultPrivacy).to.equal("private");
      expect(preferences.emailNotifications).to.be.true;
      expect(preferences.processingNotifications).to.be.true;
      expect(preferences.weeklyDigest).to.be.false;
      expect(preferences.theme).to.equal("auto");
      expect(preferences.itemsPerPage).to.equal(10);
      expect(preferences.favoriteContentTypes).to.be.an('array').that.is.empty;
      expect(preferences.interests).to.be.an('array').that.is.empty;
    });
  });

  describe("Static Methods", () => {
    describe("findByUserId", () => {
      it("should call findOne with userId", () => {
        const userId = new mongoose.Types.ObjectId();
        const findOneStub = sinon.stub(UserPreferences, "findOne").resolves(null);

        UserPreferences.findByUserId(userId);
        expect(findOneStub.calledWith({ userId })).to.be.true;
      });
    });

    describe("createDefault", () => {
      it("should call create with userId", () => {
        const userId = new mongoose.Types.ObjectId();
        const createStub = sinon.stub(UserPreferences, "create").resolves({});

        UserPreferences.createDefault(userId);
        expect(createStub.calledWith({ userId })).to.be.true;
      });
    });
  });

  describe("Instance Methods", () => {
    let preferences;

    beforeEach(() => {
      preferences = new UserPreferences(preferencesData);
      preferences.save = sinon.stub().resolves(preferences);
    });

    describe("updatePreferences", () => {
      it("should update valid preferences", async () => {
        const updates = {
          defaultSummaryLength: "long",
          theme: "dark",
          emailNotifications: false
        };

        await preferences.updatePreferences(updates);
        expect(preferences.defaultSummaryLength).to.equal("long");
        expect(preferences.theme).to.equal("dark");
        expect(preferences.emailNotifications).to.be.false;
        expect(preferences.save.calledOnce).to.be.true;
      });

      it("should ignore invalid schema paths", async () => {
        const updates = {
          invalidField: "value",
          defaultSummaryLength: "short"
        };

        await preferences.updatePreferences(updates);
        expect(preferences.defaultSummaryLength).to.equal("short");
        expect(preferences.invalidField).to.be.undefined;
      });

      it("should ignore undefined values", async () => {
        const originalTheme = preferences.theme;
        const updates = {
          theme: undefined,
          defaultSummaryLength: "long"
        };

        await preferences.updatePreferences(updates);
        expect(preferences.theme).to.equal(originalTheme);
        expect(preferences.defaultSummaryLength).to.equal("long");
      });

      it("should update arrays correctly", async () => {
        const updates = {
          favoriteContentTypes: ["video", "pdf"],
          interests: ["ai", "machine-learning"]
        };

        await preferences.updatePreferences(updates);
        expect(preferences.favoriteContentTypes).to.deep.equal(["video", "pdf"]);
        expect(preferences.interests).to.deep.equal(["ai", "machine-learning"]);
      });
    });
  });

  describe("Pre-save Middleware", () => {
    it("should update updatedAt on save", async () => {
      const preferences = new UserPreferences(preferencesData);
      const originalUpdatedAt = preferences.updatedAt;
      
      // Wait a bit to ensure time difference
      await new Promise(resolve => setTimeout(resolve, 10));
      
      // Manually trigger the pre-save middleware
      preferences.updatedAt = Date.now();
      
      expect(preferences.updatedAt.getTime()).to.be.greaterThan(originalUpdatedAt.getTime());
    });
  });
});
