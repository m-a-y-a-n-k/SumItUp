const chai = require("chai");
const { expect } = chai;
const sinon = require("sinon");
const User = require("../../src/models/User");
const adController = require("../../src/controllers/ad");

describe("Ad Controller", () => {
  describe("checkAdEligibility", () => {
    it("should return true if user is eligible for ads", async () => {
      // Stub the User.findById method to return a user with adEligible: true
      sinon.stub(User, "findById").resolves({ adEligible: true });

      // Call the checkAdEligibility method with a userId
      const result = await adController.checkAdEligibility("user123");

      // Expect the result to be true
      expect(result).to.be.true;

      // Restore the stub after the test
      User.findById.restore();
    });

    it("should return false if user is not eligible for ads", async () => {
      // Stub the User.findById method to return a user with adEligible: false
      sinon.stub(User, "findById").resolves({ adEligible: false });

      // Call the checkAdEligibility method with a userId
      const result = await adController.checkAdEligibility("user456");

      // Expect the result to be false
      expect(result).to.be.false;

      // Restore the stub after the test
      User.findById.restore();
    });

    it("should throw an error if user lookup fails", async () => {
      // Stub the User.findById method to throw an error
      sinon.stub(User, "findById").throws(new Error("User lookup failed"));

      // Call the checkAdEligibility method with a userId
      try {
        await adController.checkAdEligibility("user789");
      } catch (error) {
        // Expect an error to be thrown
        expect(error).to.exist;
        expect(error.message).to.equal("User lookup failed");
      }

      // Restore the stub after the test
      User.findById.restore();
    });
  });
});
