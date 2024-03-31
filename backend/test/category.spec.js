const chai = require("chai");
const chaiHttp = require("chai-http");
const sinon = require("sinon");
const jwt = require("jsonwebtoken");

const app = require("../index.js");
const Category = require("../models/categoryModel.js");
const User = require("../models/userModel.js");
const Organization = require("../models/organizationModel.js");

const expect = chai.expect;
chai.use(chaiHttp);

describe("Category Controllers", () => {
  afterEach(() => {
    sinon.restore();
  });

  beforeEach(() => {
    const jwtStub = sinon.stub(jwt, "verify");
    jwtStub.resolves("mockId");
    sinon.stub(User, "findOne").resolves({
      role: "admin",
    });
  });

  describe("POST /category/create", () => {
    it("should create a new category when organization exists", async () => {
      const mockOrganization = {
        _id: "65f316a1991edde66ee55fc1",
        name: "Mock Organization",
        email: "test@gmail.com",
        admins: [],
        employees: [],
      };

      sinon.stub(Organization, "findById").resolves(mockOrganization);

      const mockCategory = {
        _id: "mockCategoryId",
        name: "TestCategory",
        identificationType: "unique",
        vendors: ["Vendor1", "Vendor2"],
        customFields: [],
        orgId: "65f316a1991edde66ee55fc1",
      };

      sinon.stub(Category.prototype, "save").resolves(mockCategory);

      const res = await chai
        .request(app)
        .post("/category/create")
        .set("Authorization", "Bearer mocktoken")
        .send({
          name: "TestCategory1",
          identificationType: "unique",
          vendors: ["Vendor1", "Vendor2"],
          customFields: [],
          orgId: "65f316a1991edde66ee55fc1",
        });

      expect(res).to.have.status(201);
    });

    it("shouldn't create a category when organization doesn't exist", async () => {
      sinon.stub(Organization, "findById").resolves(null);

      const res = await chai
        .request(app)
        .post("/category/create")
        .set("Authorization", "Bearer Mockedtoken")
        .send({
          name: "TestCategory new",
          identificationType: "unique",
          vendors: ["Vendor1", "Vendor2"],
          customFields: [],
          orgId: "65f316a1991edde66ee55fc1",
        });

      expect(res).to.have.status(400);
      expect(res.body.message).to.equal(
        "Organization with orgId: 65f316a1991edde66ee55fc1 does not exist"
      );
    });

    it("Not able to save the category", async () => {
      const mockOrganization = {
        _id: "65f316a1991edde66ee55fc1",
        name: "Mock Organization",
        email: "test@gmail.com",
        admins: [],
        employees: [],
      };

      sinon.stub(Organization, "findById").resolves(mockOrganization);

      sinon.stub(Category.prototype, "save").rejects();

      const res = await chai
        .request(app)
        .post("/category/create")
        .set("Authorization", "Bearer Mockedtoken")
        .send({
          name: "TestCategory3",
          identificationType: "unique",
          vendors: ["Vendor1", "Vendor2"],
          customFields: [],
          orgId: "65f316a1991edde66ee55fc1",
        });

      expect(res).to.have.status(400);
    });
  });

  describe("DELETE /category/delete", () => {
    it("delete category if category exists", async () => {
      const mockCategoryId = "65f316a1991edde66ee55fc1";

      const mockCategory = {
        _id: mockCategoryId,
        name: "TestCategory",
        identificationType: "unique",
        vendors: [],
        customFields: [],
        orgId: "65f316a1991edde66ee55fc1",
      };

      sinon.stub(Category, "findByIdAndDelete").resolves(mockCategory);

      const res = await chai
        .request(app)
        .delete("/category/delete")
        .set("Authorization", "Bearer Mockedtoken")
        .send({
          categoryId: mockCategoryId,
        });
      expect(res).to.have.status(201);
    });

    it("category Id not provided inside request", async () => {
      const res = await chai
        .request(app)
        .delete("/category/delete")
        .set("Authorization", "Bearer Mockedtoken")
        .send({
          categoryId: null,
        });
      expect(res).to.have.status(400);
    });

    it("category with given categoryId don't exist ", async () => {
      const mockCategoryId = "65f316a1991edde66ee55fc1";

      sinon.stub(Category, "findByIdAndDelete").resolves(null);

      const res = await chai
        .request(app)
        .delete("/category/delete")
        .set("Authorization", "Bearer Mockedtoken")
        .send({
          categoryId: mockCategoryId,
        });

      expect(res).to.have.status(400);
      expect(res.body.message).to.equal(
        "category with categoryId 65f316a1991edde66ee55fc1 doesn't exist"
      );
    });
  });

  describe("PUT /category/update", () => {
    it("category Id not provided inside request", async () => {
      const res = await chai
        .request(app)
        .put("/category/update")
        .set("Authorization", "Bearer Mockedtoken")
        .send({
          categoryId: null,
        });
      expect(res).to.have.status(400);
    });

    it("update category if category exists", async () => {
      const mockCategoryId = "65f316a1991edde66ee55fc1";

      const mockCategory = {
        _id: mockCategoryId,
        name: "TestCategory",
        identificationType: "unique",
        vendors: [],
        customFields: [],
        orgId: "65f316a1991edde66ee55fc1",
      };

      sinon.stub(Category, "findByIdAndUpdate").resolves(mockCategory);

      const res = await chai
        .request(app)
        .put("/category/update")
        .set("Authorization", "Bearer Mockedtoken")
        .send({
          categoryId: mockCategoryId,
        });
      expect(res).to.have.status(201);
    });

    it("category with categoryId doesn't exist exists", async () => {
      const mockCategoryId = "65f316a1991edde66ee55fc1";

      sinon.stub(Category, "findByIdAndUpdate").resolves(null);

      const res = await chai
        .request(app)
        .put("/category/update")
        .set("Authorization", "Bearer Mockedtoken")
        .send({
          categoryId: mockCategoryId,
        });
      expect(res).to.have.status(400);
      expect(res.body.message).to.equal(
        "category with categoryId 65f316a1991edde66ee55fc1 doesn't exist"
      );
    });
  });

  describe("GET /category/:orgId", () => {
    it("should return category information with inventory count", async () => {
      const mockOrgId = "65f316a1991edde66ee55fc1";

      const mockOrganization = {
        _id: mockOrgId,
        name: "Mock Organization",
        email: "test@gmail.com",
        admins: [],
        employees: [],
      };

      sinon.stub(Organization, "findById").resolves(mockOrganization);

      const mockCategoriesWithInventories = [
        {
          _id: "mockCategoryId1",
          name: "Category1",
          identificationType: "unique",
          orgId: mockOrgId,
          customFields: [],
          vendors: ["Vendor1", "Vendor2"],
          inventoryItems: [{ quantity: 5 }, { quantity: 3 }],
        },
        {
          _id: "mockCategoryId2",
          name: "Category2",
          identificationType: "unique",
          orgId: mockOrgId,
          customFields: [],
          vendors: ["Vendor3", "Vendor4"],
          inventoryItems: [{ quantity: 8 }, { quantity: 2 }],
        },
      ];

      sinon.stub(Category, "aggregate").resolves(mockCategoriesWithInventories);

      const res = await chai
        .request(app)
        .get(`/category/${mockOrgId}`)
        .set("Authorization", "Bearer Mockedtoken")
        .send();

      expect(res).to.have.status(201);
    });

    it("org doen't exist", async () => {
      const mockOrgId = "65f316a1991edde66ee55fc1";

      sinon.stub(Organization, "findById").resolves(null);

      const res = await chai
        .request(app)
        .get(`/category/${mockOrgId}`)
        .set("Authorization", "Bearer Mockedtoken")
        .send();

      expect(res).to.have.status(400);
    });
  });
});
