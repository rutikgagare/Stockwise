const chai = require("chai");
const app = require("../index.js"); 
const chaiHttp = require("chai-http");
const Category = require("../models/categoryModel.js");
const Organization = require("../models/organizationModel.js");
const sinon = require("sinon");
const jwt = require('jsonwebtoken');

const expect = chai.expect;
chai.use(chaiHttp);

// Mock user ID for the token
const userId = 'mockUserId';

// Mock token generation function
const generateToken = (userId, role) => {
  return jwt.sign({ _id: userId, role: role }, process.env.SECRET);
};

// Stub JWT verify method to return a decoded token with the desired role
const jwtStub = sinon.stub(jwt, 'verify').callsFake((token, secret, callback) => {
  const decodedToken = jwt.decode(token);
  callback(null, decodedToken);
});

describe("Category Controller", () => {
  let categoryController;

  beforeEach(() => {
    categoryController = require("../controllers/categoryController.js");
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("POST /create", () => {
    it("should create a new category when user is an admin", async () => {
      const reqBody = {
        name: "Test Category",
        identificationType: "Test Type",
        vendors: [],
        customFields: [],
        orgId: "mockOrgId",
      };

      const res = await chai
        .request(app)
        .post("/category/create")
        .send(reqBody)
        .set("Authorization", `Bearer ${generateToken(userId, 'admin')}`); // Use the admin token here

      expect(res).to.have.status(201); // Assuming 201 Created is the expected status
      expect(res.body).to.have.property("categoryId"); // Assuming your response returns the created category
    });

    it("should handle errors gracefully when user is not an admin", async () => {
      const reqBody = {
        name: "Test Category",
        identificationType: "Test Type",
        vendors: [],
        customFields: [],
        orgId: "mockOrgId",
      };

      const res = await chai
        .request(app)
        .post("/category/create")
        .send(reqBody)
        .set("Authorization", `Bearer ${generateToken(userId, 'user')}`); // Use the non-admin token here

      expect(res).to.have.status(401);
      expect(res.body).to.have.property("error");
      expect(res.body.error).to.equal("Request is not authorized");
    });
  });
});
