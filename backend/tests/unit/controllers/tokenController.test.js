const { expect } = require("chai");
const sinon = require("sinon");
const mongoose = require("mongoose");

const tokenController = require("../../../src/controllers/token");
const User = require("../../../src/models/User");
const cache = require("../../../src/cache"); // Import the central cache

describe("Token Controller", () => {
  let req, res, user;

  beforeEach(() => {
    // Mock request and response objects
    req = {
      user: { id: new mongoose.Types.ObjectId() }, // Mock authenticated user
      body: {},
    };
    res = {
      status: sinon.stub().returnsThis(),
      send: sinon.stub(),
    };

    // Mock a user object
    user = {
      _id: req.user.id,
      tokens: 100,
      adEligible: true,
      save: sinon.stub().resolves(),
    };

    sinon.stub(User, "findById").resolves(user); // Mock the User.findById method
    sinon.stub(User, "findByIdAndUpdate").resolves();
    sinon.stub(cache, "get").callsFake((key) => {
      if (key === `user:${req.user.id}`) {
        return {
          tokens: user.tokens,
          adEligible: user.adEligible,
        };
      }
      return null;
    });
    sinon.stub(cache, "set").resolves(); // Mock the cache.set method
  });

  afterEach(() => {
    sinon.restore(); // Restore original behavior of stubbed methods
  });

  describe("earnTokens", () => {
    it("should return 400 if adId is not provided", async () => {
      await tokenController.earnTokens(req, res);

      expect(res.status.calledWith(400)).to.be.true;
      expect(res.send.calledWith({ error: "Ad ID is required" })).to.be.true;
    });

    it("should return 404 if user is not found", async () => {
      User.findById.resolves(null);
      cache.get.callsFake(() => null);

      req.body.adId = "someAdId";
      await tokenController.earnTokens(req, res);

      expect(res.status.calledWith(404)).to.be.true;
      expect(res.send.calledWith({ error: "User not found" })).to.be.true;
    });

    it("should return 400 if user is not adEligible", async () => {
      user.adEligible = false;

      req.body.adId = "someAdId";
      await tokenController.earnTokens(req, res);

      expect(res.status.calledWith(400)).to.be.true;
      expect(
        res.send.calledWith({
          error: "User is not eligible for earning ads based tokens",
        })
      ).to.be.true;
    });

    it("should successfully earn tokens if all conditions are met", async () => {
      req.body.adId = "someAdId";
      await tokenController.earnTokens(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(
        res.send.calledWith({
          message: "Tokens earned successfully",
          tokens: 150,
        })
      ).to.be.true;
      expect(
        cache.set.calledWith(`user:${req.user.id}`, {
          tokens: 150,
          adEligible: true,
        })
      ).to.be.true; // Check cache update
    });
  });

  describe("spendTokens", () => {
    it("should return 400 if tokens are not provided or invalid", async () => {
      await tokenController.spendTokens(req, res);

      expect(res.status.calledWith(400)).to.be.true;
      expect(
        res.send.calledWith({
          error: "A positive number of tokens is required",
        })
      ).to.be.true;
    });

    it("should return 404 if user is not found", async () => {
      User.findById.resolves(null);
      cache.get.callsFake(() => null);

      req.body.tokens = 50;
      await tokenController.spendTokens(req, res);

      expect(res.status.calledWith(404)).to.be.true;
      expect(res.send.calledWith({ error: "User not found" })).to.be.true;
    });

    it("should return 400 if user has insufficient tokens", async () => {
      user.tokens = 30; // Less than what will be spent

      req.body.tokens = 50;
      await tokenController.spendTokens(req, res);

      expect(res.status.calledWith(400)).to.be.true;
      expect(res.send.calledWith({ error: "Insufficient tokens" })).to.be.true;
    });

    it("should return 400 if user has already opted out of ads", async () => {
      user.adEligible = false; // User is not ad eligible

      req.body.tokens = 80;
      await tokenController.spendTokens(req, res);

      expect(res.status.calledWith(400)).to.be.true;
      expect(
        res.send.calledWith({
          error: "User has already spent tokens and opted out of ads",
        })
      ).to.be.true;
    });

    it("should successfully spend tokens if all conditions are met", async () => {
      req.body.tokens = 80;
      await tokenController.spendTokens(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(
        res.send.calledWith({
          message: "Tokens spent successfully",
          tokens: 20,
        })
      ).to.be.true;
      expect(
        cache.set.calledWith(`user:${req.user.id}`, {
          tokens: 20,
          adEligible: false,
        })
      ).to.be.true; // Check cache update
      expect(cache.set.calledWith(`adEligibility:${req.user.id}`, false)).to.be
        .true; // Check cache update
    });
  });
});
