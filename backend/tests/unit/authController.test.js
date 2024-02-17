const chai = require("chai");
const { expect } = chai;
const sinon = require("sinon");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authController = require("../../src/controllers/auth");
const User = require("../../src/models/User.js");

describe("Auth Controller", () => {
  describe("signup", () => {
    it("should create a new user", async () => {
      const req = {
        body: { email: "test@example.com", password: "Password1" },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };

      // Stubbing User.findOne to return null (no existing user)
      sinon.stub(User, "findOne").resolves(null);
      sinon
        .stub(User.prototype, "save")
        .resolves({ _id: "123456", email: "test@example.com" });

      await authController.signup(req, res);

      expect(res.status.calledOnceWith(201)).to.be.true;
      expect(res.json.calledOnce).to.be.true;

      // Restore stubs
      User.findOne.restore();
      User.prototype.save.restore();
    });

    it("should return 400 if email is missing", async () => {
      const req = {
        body: { password: "Password1" },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };

      await authController.signup(req, res);

      expect(res.status.calledOnceWith(400)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      expect(res.json.calledWith({ error: "Email and password are required" }))
        .to.be.true;
    });

    it("should return 400 if password is missing", async () => {
      const req = {
        body: { email: "test@example.com" },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };

      await authController.signup(req, res);

      expect(res.status.calledOnceWith(400)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      expect(res.json.calledWith({ error: "Email and password are required" }))
        .to.be.true;
    });

    it("should return 400 if email is invalid", async () => {
      const req = {
        body: { email: "invalid-email", password: "Password1" },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };

      await authController.signup(req, res);

      expect(res.status.calledOnceWith(400)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      expect(res.json.calledWith({ error: "Invalid email format" })).to.be.true;
    });

    it("should return 400 if password is weak", async () => {
      const req = {
        body: { email: "test@example.com", password: "123456" },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };

      await authController.signup(req, res);

      expect(res.status.calledOnceWith(400)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      expect(
        res.json.calledWith({
          error: "Password must be alphanumeric and at least 8 characters long",
        })
      ).to.be.true;
    });

    it("should return 409 if user already exists", async () => {
      const req = {
        body: { email: "existing-user@example.com", password: "Password1" },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };

      sinon
        .stub(User, "findOne")
        .resolves({ email: "existing-user@example.com" });

      await authController.signup(req, res);

      expect(res.status.calledOnceWith(409)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      expect(res.json.calledWith({ error: "User already exists" })).to.be.true;

      User.findOne.restore();
    });
  });

  describe("login", () => {
    it("should generate a JWT token for valid user", async () => {
      const req = {
        body: { email: "test@example.com", password: "Password1" },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };

      sinon.stub(User, "findOne").resolves({
        _id: "123456",
        email: "test@example.com",
        password: "hashedPassword",
      });
      sinon.stub(bcrypt, "compare").resolves(true);
      sinon.stub(jwt, "sign").returns("token");

      await authController.login(req, res);

      expect(res.status.calledOnceWith(200)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      expect(res.json.calledWith({ token: "token" })).to.be.true;

      User.findOne.restore();
      bcrypt.compare.restore();
      jwt.sign.restore();
    });

    it("should return 400 if email is missing", async () => {
      const req = {
        body: { password: "Password1" },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };

      await authController.login(req, res);

      expect(res.status.calledOnceWith(400)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      expect(res.json.calledWith({ error: "Email and password are required" }))
        .to.be.true;
    });

    it("should return 400 if password is missing", async () => {
      const req = {
        body: { email: "test@example.com" },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };

      await authController.login(req, res);

      expect(res.status.calledOnceWith(400)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      expect(res.json.calledWith({ error: "Email and password are required" }))
        .to.be.true;
    });

    it("should return 401 if user is not found", async () => {
      const req = {
        body: { email: "nonexistent@example.com", password: "Password1" },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };

      sinon.stub(User, "findOne").resolves(null);

      await authController.login(req, res);

      expect(res.status.calledOnceWith(401)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      expect(res.json.calledWith({ error: "User not found" })).to.be.true;

      User.findOne.restore();
    });

    it("should return 401 if password is incorrect", async () => {
      const req = {
        body: { email: "test@example.com", password: "IncorrectPassword" },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };

      sinon.stub(User, "findOne").resolves({
        _id: "123456",
        email: "test@example.com",
        password: "hashedPassword",
      });
      sinon.stub(bcrypt, "compare").resolves(false);

      await authController.login(req, res);

      expect(res.status.calledOnceWith(401)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      expect(res.json.calledWith({ error: "Invalid credentials" })).to.be.true;

      User.findOne.restore();
      bcrypt.compare.restore();
    });
  });
});
