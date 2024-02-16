import { expect } from 'chai';
import sinon from 'sinon';
import adController from '../../src/controllers/adController.mjs';

describe('Ad Controller', () => {
  describe('displayAds', () => {
    it('should display ads', async () => {
      // Mock request and response objects
      const req = {};
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };

      // Call the controller method
      await adController.displayAds(req, res);

      // Assertions
      expect(res.status.calledOnceWith(200)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
    });
  });
});
