const chai = require("chai");
const { expect } = chai;
const sinon = require("sinon");
const User = require("../../../src/models/User");
const adController = require("../../../src/controllers/ad");

describe("Ad Controller", () => {
  describe("checkAdEligibility", () => {
    let res;

    beforeEach(() => {
      res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub().returnsThis(),
      };
    });

    afterEach(() => {
      sinon.restore();
    });

    it("should return true if user is eligible for ads", async () => {
      // Stub the User.findById method to return a user with adEligible: true
      sinon.stub(User, "findById").resolves({ adEligible: true });

      const req = { user: { userId: "user123" } };

      await adController.checkAdEligibility(req, res);

      // Expect the response to be sent with the correct status and JSON
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith({ eligible: true })).to.be.true;
    });

    it("should return false if user is not eligible for ads", async () => {
      // Stub the User.findById method to return a user with adEligible: false
      sinon.stub(User, "findById").resolves({ adEligible: false });

      const req = { user: { userId: "user456" } };

      await adController.checkAdEligibility(req, res);

      // Expect the response to be sent with the correct status and JSON
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith({ eligible: false })).to.be.true;
    });

    it("should return 404 if user is not found", async () => {
      // Stub the User.findById method to return null
      sinon.stub(User, "findById").resolves(null);

      const req = { user: { userId: "user789" } };

      await adController.checkAdEligibility(req, res);

      // Expect the response to be sent with the correct status and JSON
      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWith({ error: "User not found" })).to.be.true;
    });

    it("should return 500 if an error occurs during user lookup", async () => {
      // Stub the User.findById method to throw an error
      sinon.stub(User, "findById").throws(new Error("User lookup failed"));

      const req = { user: { userId: "user000" } };

      await adController.checkAdEligibility(req, res);

      // Expect the response to be sent with the correct status and JSON
      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({ error: "Failed to check ad eligibility" }))
        .to.be.true;
    });
  });
});
