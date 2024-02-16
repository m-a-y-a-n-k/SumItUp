// test/unit/tokenController.test.mjs
import { expect } from "chai";
import sinon from "sinon";
import tokenController from "../../src/controllers/tokenController.mjs";

describe("Token Controller", () => {
  describe("earnTokens", () => {
    it("should earn tokens", async () => {
      // Mock request and response objects
      const req = {};
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };

      // Call the controller method
      await tokenController.earnTokens(req, res);

      // Assertions
      expect(res.status.calledOnceWith(200)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
    });
  });

  describe("spendTokens", () => {
    it("should spend tokens", async () => {
      // Mock request and response objects
      const req = {};
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };

      // Call the controller method
      await tokenController.spendTokens(req, res);

      // Assertions
      expect(res.status.calledOnceWith(200)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
    });
  });
});
