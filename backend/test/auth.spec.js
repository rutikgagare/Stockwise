const chai = require("chai");
const chaiHttp = require("chai-http");
const sinon = require("sinon");
const jwt = require("jsonwebtoken");

const app = require("../index.js");
const User = require("../models/userModel.js");

const expect = chai.expect;
chai.use(chaiHttp);

describe("User Controllers", () => {
  afterEach(() => {
    sinon.restore();
  });

  beforeEach(() => {
    sinon.stub(jwt, "sign").callsFake((_id, secret, options) => {
      return "dummyToken_123456789";
    });
  });

  const mockedUser = {
    email: "example@example.com",
    password: "password123",
  };

  const mockedUser1 = {
    _id: "609d22d79c780a2d8fc1ebd2",
    name: "John Doe",
    email: "example@example.com",
    password: "password123",
    role: "admin",
  };

  const mockedUser2 = {
    id: "609d22d79c780a2d8fc1ebd2",
    name: "John Doe",
    email: "example@example.com",
    role: "admin",
    token: "dummyToken_123456789",
  };

  describe("POST /auth/login", () => {
    it("User should be able to login", async () => {
      sinon.stub(User, "login").returns(mockedUser1);

      const res = await chai.request(app).post("/auth/login").send(mockedUser);

      expect(res).to.have.status(200);
      expect(res.body).to.deep.equal(mockedUser2);
    });

    it("User should not be able to login if any validation fails", async () => {
      sinon.stub(User, "login").throws(new Error());

      const res = await chai.request(app).post("/auth/login").send(mockedUser);

      expect(res).to.have.status(400);
      expect(res.body).to.have.property("error");
    });
  });

  describe("POST /auth/signup", () => {
    const mockedUserSingnup = {
      name: "John Doe",
      email: "example@example.com",
      password: "password123",
      role: "user",
    };

    it("User should be able to signup", async () => {
      sinon.stub(User, "signup").returns(mockedUser1);

      const res = await chai
        .request(app)
        .post("/auth/signup")
        .send(mockedUserSingnup);

      expect(res).to.have.status(200);
      expect(res.body).to.deep.equal(mockedUser2);
    });

    it("User should not be able to signup if any validation fails", async () => {
      sinon.stub(User, "signup").throws(new Error());

      const res = await chai.request(app).post("/auth/signup").send(mockedUser);

      expect(res).to.have.status(400);
      expect(res.body).to.have.property("error");
    });
  });
});
