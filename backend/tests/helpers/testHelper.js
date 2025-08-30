const mongoose = require("mongoose");
const sinon = require("sinon");

/**
 * Test Helper Utilities for SumItUp Backend Tests
 */

class TestHelper {
  /**
   * Create a mock request object with common properties
   * @param {Object} overrides - Properties to override
   * @returns {Object} Mock request object
   */
  static createMockRequest(overrides = {}) {
    return {
      body: {},
      params: {},
      query: {},
      user: { id: "user123" },
      file: null,
      ...overrides
    };
  }

  /**
   * Create a mock response object with sinon stubs
   * @returns {Object} Mock response object
   */
  static createMockResponse() {
    return {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
      send: sinon.spy(),
      setHeader: sinon.spy(),
      pipe: sinon.spy()
    };
  }

  /**
   * Create a mock file object for file upload tests
   * @param {Object} overrides - Properties to override
   * @returns {Object} Mock file object
   */
  static createMockFile(overrides = {}) {
    return {
      originalname: "test.jpg",
      mimetype: "image/jpeg",
      size: 1000,
      buffer: Buffer.from("test file content"),
      ...overrides
    };
  }

  /**
   * Create a mock MongoDB ObjectId
   * @returns {mongoose.Types.ObjectId} Mock ObjectId
   */
  static createMockObjectId() {
    return new mongoose.Types.ObjectId();
  }

  /**
   * Create mock content data for testing
   * @param {Object} overrides - Properties to override
   * @returns {Object} Mock content data
   */
  static createMockContentData(overrides = {}) {
    return {
      userId: this.createMockObjectId(),
      title: "Test Content",
      originalContent: "This is test content",
      summary: "Test summary",
      contentType: "text",
      metadata: {
        processingTime: 1500,
        confidence: 0.95,
        wordCount: 50,
        language: "en"
      },
      tags: ["test", "content"],
      isFavorite: false,
      isPublic: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...overrides
    };
  }

  /**
   * Create mock user preferences data for testing
   * @param {Object} overrides - Properties to override
   * @returns {Object} Mock preferences data
   */
  static createMockPreferencesData(overrides = {}) {
    return {
      userId: this.createMockObjectId(),
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
      createdAt: new Date(),
      updatedAt: new Date(),
      ...overrides
    };
  }

  /**
   * Create mock user data for testing
   * @param {Object} overrides - Properties to override
   * @returns {Object} Mock user data
   */
  static createMockUserData(overrides = {}) {
    return {
      _id: this.createMockObjectId(),
      username: "testuser",
      email: "test@example.com",
      password: "hashedpassword123",
      tokens: 100,
      adEligible: true,
      verified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...overrides
    };
  }

  /**
   * Assert that response has error status and message
   * @param {Object} res - Response object
   * @param {number} statusCode - Expected status code
   * @param {string} errorMessage - Expected error message
   */
  static assertErrorResponse(res, statusCode, errorMessage) {
    const chai = require("chai");
    const { expect } = chai;
    
    expect(res.status.calledWith(statusCode)).to.be.true;
    expect(res.json.calledWith({ error: errorMessage })).to.be.true;
  }

  /**
   * Assert that response has success status
   * @param {Object} res - Response object
   * @param {number} statusCode - Expected status code (default: 200)
   */
  static assertSuccessResponse(res, statusCode = 200) {
    const chai = require("chai");
    const { expect } = chai;
    
    expect(res.status.calledWith(statusCode)).to.be.true;
    expect(res.json.calledOnce).to.be.true;
  }

  /**
   * Get the response data from a mocked response
   * @param {Object} res - Response object
   * @returns {Object} Response data
   */
  static getResponseData(res) {
    return res.json.getCall(0).args[0];
  }

  /**
   * Clean up sinon stubs and spies
   */
  static cleanup() {
    sinon.restore();
  }

  /**
   * Create a mock database query chain
   * @param {*} returnValue - Value to return from the chain
   * @returns {Object} Mock query chain
   */
  static createMockQueryChain(returnValue = []) {
    return {
      sort: sinon.stub().returnsThis(),
      limit: sinon.stub().returnsThis(),
      skip: sinon.stub().returnsThis(),
      populate: sinon.stub().returnsThis(),
      exec: sinon.stub().resolves(returnValue),
      then: sinon.stub().resolves(returnValue)
    };
  }

  /**
   * Create a mock model with common methods
   * @param {Object} data - Data to return
   * @returns {Object} Mock model
   */
  static createMockModel(data = {}) {
    return {
      ...data,
      save: sinon.stub().resolves(data),
      remove: sinon.stub().resolves(),
      deleteOne: sinon.stub().resolves({ deletedCount: 1 }),
      updateOne: sinon.stub().resolves({ modifiedCount: 1 }),
      toObject: sinon.stub().returns(data),
      toJSON: sinon.stub().returns(data)
    };
  }

  /**
   * Validate that all required fields are present in response
   * @param {Object} response - Response object to validate
   * @param {Array} requiredFields - Array of required field names
   */
  static validateResponseFields(response, requiredFields) {
    const chai = require("chai");
    const { expect } = chai;
    
    requiredFields.forEach(field => {
      expect(response).to.have.property(field);
    });
  }

  /**
   * Create a timeout promise for async testing
   * @param {number} ms - Milliseconds to wait
   * @returns {Promise} Promise that resolves after timeout
   */
  static timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

module.exports = TestHelper;
