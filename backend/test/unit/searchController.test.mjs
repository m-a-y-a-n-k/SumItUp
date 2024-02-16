// test/unit/searchController.test.mjs
import { expect } from "chai";
import sinon from "sinon";
import searchController from "../../src/controllers/searchController.mjs";

describe("Search Controller", () => {
  describe("fuzzySearch", () => {
    it("should perform fuzzy search", async () => {
      // Mock request and response objects
      const req = {};
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };

      // Call the controller method
      await searchController.fuzzySearch(req, res);

      // Assertions
      expect(res.status.calledOnceWith(200)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
    });
  });
});
