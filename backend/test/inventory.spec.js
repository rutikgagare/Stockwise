const chai = require("chai");
const chaiHttp = require("chai-http");
const sinon = require("sinon");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const app = require("../index.js");
const Inventory = require("../models/inventoryModel.js");
const Category = require("../models/categoryModel.js");
const User = require("../models/userModel.js");

const expect = chai.expect;
chai.use(chaiHttp);

describe("Inventory Controllers", () => {
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

  const mockedCategoryId = "66093a62bb4b6781a41472c0";

  const mockedCategory = {
    _id: mockedCategoryId,
    name: "TestCategory2",
    identificationType: "unique",
    orgId: "65f316a1991edde66ee55fc1",
    customFields: [],
    vendors: [],
  };

  const mockedItem1 = {
    name: "Test Item",
    identificationType: "unique",
    categoryId: "65f316a1991edde66ee55fc1",
    orgId: "65f316a1991edde66ee55fc1",
    quantity: 1,
    serialNumber: "ABC123",
    customFieldsData: {},
    assignedTo: [],
    status: "ready to deploy",
    checkedOutQuantity: 0,
    itemImage: "image-url.jpg",
    lifecycle: [],
  };

  const mockedItem2 = {
    _id: "60972d3e8a0d0e001f31b97f",
    name: "Test Item",
    identificationType: "unique",
    categoryId: "65f316a1991edde66ee55fc1",
    orgId: "65f316a1991edde66ee55fc1",
    quantity: 1,
    serialNumber: "ABC123",
    customFieldsData: {},
    assignedTo: [],
    status: "ready to deploy",
    checkedOutQuantity: 0,
    itemImage: "image-url.jpg",
    lifecycle: [],
  };

  const mockedItem3 = {
    itemDetails: {
      name: "Test Item",
      identificationType: "unique",
      categoryId: "65f316a1991edde66ee55fc1",
      orgId: "65f316a1991edde66ee55fc1",
      quantity: 1,
      customFieldsData: {},
      assignedTo: [],
      status: "ready to deploy",
      checkedOutQuantity: 0,
      itemImage: "image-url.jpg",
      lifecycle: [],
    },
    serialNumbers: ["ABC123", "DEF456"],
  };

  const mockedItem4 = [
    {
      _id: "60972d3e8a0d0e001f31b97f",
      name: "Test Item",
      identificationType: "unique",
      categoryId: "65f316a1991edde66ee55fc1",
      orgId: "65f316a1991edde66ee55fc1",
      quantity: 1,
      customFieldsData: {},
      assignedTo: [],
      status: "ready to deploy",
      checkedOutQuantity: 0,
      itemImage: "image-url.jpg",
      lifecycle: [],
      serialNumber: "ABC123",
    },
    {
      _id: "60972d3e8a0d0e001f31b97f",
      name: "Test Item",
      identificationType: "unique",
      categoryId: "65f316a1991edde66ee55fc1",
      orgId: "65f316a1991edde66ee55fc1",
      quantity: 1,
      customFieldsData: {},
      assignedTo: [],
      status: "ready to deploy",
      checkedOutQuantity: 0,
      itemImage: "image-url.jpg",
      lifecycle: [],
      serialNumber: "DEF456",
    },
  ];

  describe("POST /inventory/create", () => {
    it("create item in inventory if categoryId exist", async () => {
      sinon.stub(Category, "findById").resolves(mockedCategory);

      sinon.stub(Inventory.prototype, "save").resolves(mockedItem2);

      const res = await chai
        .request(app)
        .post("/inventory/create")
        .set("Authorization", "Bearer mocktoken")
        .send(mockedItem1);

      expect(res).to.have.status(201);
    });

    it("Category with given categoryId don't exist", async () => {
      sinon.stub(Category, "findById").resolves(null);

      const res = await chai
        .request(app)
        .post("/inventory/create")
        .set("Authorization", "Bearer mocktoken")
        .send(mockedItem1);
      expect(res).to.have.status(400);
    });
  });

  describe("POST /inventory/createMultiple", () => {
    it("create multiple items in inventory if categoryId exists", async () => {
      sinon.stub(Category, "findById").resolves(mockedCategory);
      sinon.stub(Inventory.prototype, "save").resolves(mockedItem4);

      const res = await chai
        .request(app)
        .post("/inventory/createMultiple")
        .set("Authorization", "Bearer mocktoken")
        .send(mockedItem3);

      expect(res).to.have.status(201);
    });

    it("Category with given categoryId doesn't exist", async () => {
      sinon.stub(Category, "findById").resolves(null);

      const res = await chai
        .request(app)
        .post("/inventory/createMultiple")
        .set("Authorization", "Bearer mocktoken")
        .send(mockedItem3);

      expect(res).to.have.status(400);
    });

    it("Error occurred while finding the category", async () => {
      sinon
        .stub(Category, "findById")
        .throws(new Error("Internal server error"));

      const res = await chai
        .request(app)
        .post("/inventory/createMultiple")
        .set("Authorization", "Bearer mocktoken")
        .send(mockedItem1);

      expect(res).to.have.status(400);
    });

    it("if inventory has item with serial number",async ()=>{
      sinon.stub(Category, "findById").resolves(mockedCategory);

      sinon.stub(Inventory, "find").resolves([{}, {}]);

      const res = await chai
        .request(app)
        .post("/inventory/createMultiple")
        .set("Authorization", "Bearer mocktoken")
        .send(mockedItem3);

      expect(res).to.have.status(400);
    })
  });

  describe("GET /inventory/:orgId", () => {
    const mockedOrgId = "66093a62bb4b6781a41472c0";

    it("should get items if orgId exist", async () => {
      sinon.stub(Inventory, "find").resolves(mockedCategory);

      const res = await chai
        .request(app)
        .get(`/inventory/${mockedOrgId}`)
        .set("Authorization", "Bearer mocktoken")
        .send();
      expect(res).to.have.status(201);
    });

    it("should handle error if orgId doesn't exist", async () => {
      const errorMessage = "Organization not found";
      sinon.stub(Inventory, "find").throws(new Error(errorMessage));

      const res = await chai
        .request(app)
        .get(`/inventory/${mockedOrgId}`)
        .set("Authorization", "Bearer mocktoken")
        .send();

      expect(res).to.have.status(400);
      expect(res.body).to.have.property("error", errorMessage);
    });
  });

  describe("GET /inventory/getItem/:itemId", () => {
    const mockedItemId = "66093a62bb4b6781a41472c0";

    it("should get item if itemId exist", async () => {
      sinon.stub(Inventory, "findById").resolves(mockedItem2);

      const res = await chai
        .request(app)
        .get(`/inventory/getItem/${mockedItemId}`)
        .set("Authorization", "Bearer mocktoken")
        .send();
      expect(res).to.have.status(201);
    });

    it("should throw error if itemId doesn't exist", async () => {
     
      sinon.stub(Inventory, "findById").throws(new Error());

      const res = await chai
        .request(app)
        .get(`/inventory/getItem/${mockedItemId}`)
        .set("Authorization", "Bearer mocktoken")
        .send();

      expect(res).to.have.status(400);
    });
  });


  describe("DELETE /inventory/delete", async () => {
    it("Should delete item if item with itemId exist", async () => {
      const mockedItemId = "60972d3e8a0d0e001f31b97f";

      sinon.stub(Inventory, "findByIdAndDelete").resolves(mockedItem2);

      const res = await chai
        .request(app)
        .delete("/inventory/delete")
        .set("Authorization", "Bearer mocktoken")
        .send({ itemId: mockedItemId });

      expect(res).to.have.status(201);
    });

    it("item with itemId doesn't exist", async () => {
      const mockedItemId = "60972d3e8a0d0e001f31b97f";

      sinon.stub(Inventory, "findByIdAndDelete").resolves(null);

      const res = await chai
        .request(app)
        .delete("/inventory/delete")
        .set("Authorization", "Bearer mocktoken")
        .send({ itemId: mockedItemId });

      expect(res).to.have.status(400);
    });

    it("itemId not provided inside body", async () => {
      const res = await chai
        .request(app)
        .delete("/inventory/delete")
        .set("Authorization", "Bearer mocktoken")
        .send({ itemId: null });

      expect(res).to.have.status(400);
    });
  });

  describe("PUT /inventory/update", async () => {
    it("Should update item if item with itemId exist", async () => {
      const mockedItemId = "60972d3e8a0d0e001f31b97f";

      sinon.stub(Inventory, "findByIdAndUpdate").resolves(mockedItem2);

      const res = await chai
        .request(app)
        .put("/inventory/update")
        .set("Authorization", "Bearer mocktoken")
        .send({ itemId: mockedItemId });

      expect(res).to.have.status(201);
    });

    it("item with itemId doesn't exist", async () => {
      const mockedItemId = "60972d3e8a0d0e001f31b97f";

      sinon.stub(Inventory, "findByIdAndUpdate").resolves(null);

      const res = await chai
        .request(app)
        .put("/inventory/update")
        .set("Authorization", "Bearer mocktoken")
        .send({ itemId: mockedItemId });

      expect(res).to.have.status(400);
    });

    it("itemId not provided inside body", async () => {
      const res = await chai
        .request(app)
        .put("/inventory/update")
        .set("Authorization", "Bearer mocktoken")
        .send({ itemId: null });

      expect(res).to.have.status(400);
    });
  });

  describe("GET inventory/item/getUserAssets", () => {
    const mockedUserId = "610f94305c3d7d4d3e4ebcb0";

    it("should get user assets if user exists", async () => {
      const mockUserAssets = [
        {
          _id: "1",
          name: "Asset 1",
          itemImage: "image1.jpg",
          serialNumber: "SN001",
          customFieldsData: { field1: "value1" },
          quantity: 2,
        },
        {
          _id: "2",
          name: "Asset 2",
          itemImage: "image2.jpg",
          serialNumber: "SN002",
          customFieldsData: { field2: "value2" },
          quantity: 1,
        },
      ];

      sinon.stub(Inventory, "aggregate").resolves(mockUserAssets);

      const res = await chai
        .request(app)
        .get("/inventory/item/getUserAssets")
        .set("Authorization", `Bearer mocktoken`)
        .send();

      expect(res).to.have.status(201);
      expect(res.body).to.deep.equal(mockUserAssets);
    });

    it("should handle error if user does not exist", async () => {
      sinon.stub(Inventory, "aggregate").throws(new Error());

      const res = await chai
        .request(app)
        .get("/inventory/item/getUserAssets")
        .set("Authorization", `Bearer mocktoken`)
        .send();

      expect(res).to.have.status(400);
    });
  });

  const request = require("supertest");

  describe("POST /inventory/searchItems/:orgId", () => {
    const mockedOrgId = "610f94305c3d7d4d3e4ebcb0";
    const mockSearchText = "example";

    it("should return items matching the search query", async () => {
      const mockItems = [
        { _id: "1", name: "Example Item 1" },
        { _id: "2", name: "Example Item 2" },
      ];

      sinon.stub(Inventory, "aggregate").resolves(mockItems);

      const res = await request(app)
        .post(`/inventory/searchItems/${mockedOrgId}`)
        .set("Authorization", "Bearer mocktoken")
        .send({ searchText: mockSearchText });

      expect(res.status).to.equal(201);
    });

    it("should handle error if search fails", async () => {
      sinon.stub(Inventory, "aggregate").throws(new Error());

      const res = await request(app)
        .post(`/inventory/searchItems/${mockedOrgId}`)
        .set("Authorization", "Bearer mocktoken")
        .send({ searchText: mockSearchText });

      expect(res.status).to.equal(400);
    });
  });

  describe("PUT /inventory/checkout", () => {
    const mockedItemId = "610f94305c3d7d4d3e4ebcb0";

    const mockAssignedTo = {
      userId: "610f94305c3d7d4d3e4ebcb1",
      userName: "John Doe",
      quantity: 1,
    };

    it("item with itemiD doesn't e", async () => {
      sinon.stub(Inventory, "findById").resolves(null);

      const res = await request(app)
        .put("/inventory/checkout")
        .set("Content-Type", "application/json")
        .set("Authorization", "Bearer mocktoken")
        .send({
          itemId: mockedItemId,
          assignedTo: mockAssignedTo,
        });

      expect(res.status).to.equal(400);
    });

    it("should checkout unique item successfully", async () => {
      const mockItem = {
        _id: mockedItemId,
        identificationType: "unique",
        assignedTo: [],
      };

      sinon.stub(Inventory, "findById").resolves(mockItem);
      sinon.stub(Inventory, "findByIdAndUpdate").resolves(mockItem);

      const res = await request(app)
        .put("/inventory/checkout")
        .set("Content-Type", "application/json")
        .set("Authorization", "Bearer mocktoken")
        .send({
          itemId: mockedItemId,
          assignedTo: mockAssignedTo,
        });

      expect(res.status).to.equal(201);
      expect(res.body).to.deep.equal(mockItem);
    });

    it("should handle error if item is already assigned", async () => {
      const mockItem = {
        _id: mockedItemId,
        identificationType: "unique",
        assignedTo: [
          { userId: "existingUserId", userName: "Existing User", quantity: 1 },
        ],
      };

      sinon.stub(Inventory, "findById").resolves(mockItem);

      const res = await request(app)
        .put("/inventory/checkout")
        .set("Content-Type", "application/json")
        .set("Authorization", "Bearer mocktoken")
        .send({
          itemId: mockedItemId,
          assignedTo: mockAssignedTo,
        });

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property(
        "message",
        "Item already assigned, cannot reassign"
      );
    });

    it("should checkout non-unique item successfully", async () => {
      const mockItem = {
        _id: mockedItemId,
        identificationType: "non-unique",
        quantity: 5,
        checkedOutQuantity: 0,
        assignedTo: [],
      };

      sinon.stub(Inventory, "findById").resolves(mockItem);
      sinon.stub(Inventory, "findByIdAndUpdate").resolves(mockItem);

      const res = await request(app)
        .put("/inventory/checkout")
        .set("Content-Type", "application/json")
        .set("Authorization", "Bearer mocktoken")
        .send({ itemId: mockedItemId, assignedTo: mockAssignedTo });

      expect(res.status).to.equal(201);
      expect(res.body).to.deep.equal(mockItem);
    });

    it("should handle error if not enough quantity available", async () => {
      const mockItem = {
        _id: mockedItemId,
        identificationType: "non-unique",
        quantity: 5,
        checkedOutQuantity: 3,
        assignedTo: [],
      };

      sinon.stub(Inventory, "findById").resolves(mockItem);

      const res = await request(app)
        .put("/inventory/checkout")
        .set("Content-Type", "application/json")
        .set("Authorization", "Bearer mocktoken")
        .send({
          itemId: mockedItemId,
          assignedTo: { ...mockAssignedTo, quantity: 3 },
        });

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property(
        "message",
        "Not enough quantity available in inventory"
      );
    });

    it("should checkout non-unique item successfully", async () => {
      const mockItem = {
        _id: mockedItemId,
        identificationType: "non-unique",
        quantity: 5,
        checkedOutQuantity: 0,
        assignedTo: [],
      };

      sinon.stub(Inventory, "findById").resolves(mockItem);
      sinon.stub(Inventory, "findByIdAndUpdate").resolves(mockItem);

      const res = await request(app)
        .put("/inventory/checkout")
        .set("Content-Type", "application/json")
        .set("Authorization", "Bearer mocktoken")
        .send({ itemId: mockedItemId, assignedTo: mockAssignedTo });

      expect(res.status).to.equal(201);
      expect(res.body).to.deep.equal(mockItem);
    });

    it("should handle error if not enough quantity available", async () => {
      const mockItem = {
        _id: mockedItemId,
        identificationType: "non-unique",
        quantity: 5,
        checkedOutQuantity: 3,
        assignedTo: [],
      };

      sinon.stub(Inventory, "findById").resolves(mockItem);

      const res = await request(app)
        .put("/inventory/checkout")
        .set("Content-Type", "application/json")
        .set("Authorization", "Bearer mocktoken")
        .send({
          itemId: mockedItemId,
          assignedTo: { ...mockAssignedTo, quantity: 3 },
        });

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property(
        "message",
        "Not enough quantity available in inventory"
      );
    });

    it("should handle existing assignment for the user", async () => {
      const existingAssignment = [
        {
          userId: new mongoose.Types.ObjectId(mockAssignedTo.userId),
          userName: mockAssignedTo.userName,
          quantity: 2,
        },
        {
          userId: new mongoose.Types.ObjectId("610f94305c3d7d4d3e4ebcb2"),
          userName: "Another User",
          quantity: 3,
        },
      ];

      const existingAssignmentUpdated = [
        {
          userId: mockAssignedTo.userId,
          userName: mockAssignedTo.userName,
          quantity: 3,
        },
        {
          userId: "610f94305c3d7d4d3e4ebcb2",
          userName: "Another User",
          quantity: 3,
        },
      ];

      const mockItem = {
        _id: mockedItemId,
        identificationType: "non-unique",
        quantity: 5,
        checkedOutQuantity: 2,
        assignedTo: [...existingAssignment],
      };

      const mockItemUpdated = {
        _id: mockedItemId,
        identificationType: "non-unique",
        quantity: 5,
        checkedOutQuantity: 4,
        assignedTo: existingAssignmentUpdated, // Remove the array brackets here
      };

      sinon.stub(Inventory, "findById").resolves(mockItem);
      sinon.stub(Inventory, "findByIdAndUpdate").resolves(mockItemUpdated);

      const res = await request(app)
        .put("/inventory/checkout")
        .set("Content-Type", "application/json")
        .set("Authorization", "Bearer mocktoken")
        .send({ itemId: mockedItemId, assignedTo: mockAssignedTo });

      expect(res.status).to.equal(201);
      expect(res.body).to.deep.equal(mockItemUpdated);
    });
  });

  describe("PUT /inventory/checkin", () => {
    const mockedItemId = "610f94305c3d7d4d3e4ebcb0";

    it("should handle non-existent item", async () => {
      sinon.stub(Inventory, "findById").resolves(null);

      const res = await request(app)
        .put("/inventory/checkin")
        .set("Content-Type", "application/json")
        .set("Authorization", "Bearer mocktoken")
        .send({
          itemId: mockedItemId,
          quantity: 1,
        });

      expect(res.status).to.equal(400);
    });

    it("should handle checkin for unique item", async () => {
      const mockItem = {
        _id: "610f94305c3d7d4d3e4ebcb0",
        identificationType: "unique",
        assignedTo: [{ userId: "userId", userName: "User", quantity: 1 }],
        lifecycle: [{ checkinDate: "2024-03-31T19:51:19.666Z" }],
      };

      const mockItemUpdated = {
        _id: "610f94305c3d7d4d3e4ebcb0",
        identificationType: "unique",
        assignedTo: [{ userId: "userId", userName: "User", quantity: 1 }],
        lifecycle: [{ checkinDate: "2024-03-31T19:51:19.666Z" }],
      };

      sinon.stub(Inventory, "findById").resolves(mockItem);
      sinon.stub(Inventory, "findByIdAndUpdate").resolves(mockItemUpdated);

      const res = await request(app)
        .put("/inventory/checkin")
        .set("Content-Type", "application/json")
        .set("Authorization", "Bearer mocktoken")
        .send({
          itemId: mockedItemId,
          quantity: 1,
        });

      expect(res.status).to.equal(201);
      expect(res.body).to.deep.equal(mockItemUpdated);
    });

    it("cont checkin item if item is not assigned to anyone", async () => {
      const mockItem = {
        _id: "610f94305c3d7d4d3e4ebcb0",
        identificationType: "unique",
        assignedTo: [],
      };

      sinon.stub(Inventory, "findById").resolves(mockItem);

      const res = await request(app)
        .put("/inventory/checkin")
        .set("Content-Type", "application/json")
        .set("Authorization", "Bearer mocktoken")
        .send({
          itemId: mockedItemId,
          quantity: 1,
        });

      expect(res.status).to.equal(400);
    });

    it("should handle checkin for non-unique item", async () => {
      const mockItem = {
        _id: mockedItemId,
        identificationType: "non-unique",
        assignedTo: [
          {
            userId: new mongoose.Types.ObjectId("610f94305c3d7d4d3e4ebcb2"),
            userName: "User",
            quantity: 2,
          },
          {
            userId: new mongoose.Types.ObjectId("610f94305c3d7d4d3e4ebca2"),
            userName: "Another User",
            quantity: 3,
          },
        ],
      };

      const mockItemUpdated = {
        _id: "610f94305c3d7d4d3e4ebcb0",
        identificationType: "unique",
        assignedTo: [
          {
            userId: "610f94305c3d7d4d3e4ebcb2",
            userName: "User",
            quantity: 1,
          },
          {
            userId: "610f94305c3d7d4d3e4ebca2",
            userName: "Another User",
            quantity: 3,
          },
        ],
      };

      sinon.stub(Inventory, "findById").resolves(mockItem);
      sinon.stub(Inventory, "findByIdAndUpdate").resolves(mockItemUpdated);

      const res = await request(app)
        .put("/inventory/checkin")
        .set("Content-Type", "application/json")
        .set("Authorization", "Bearer mocktoken")
        .send({
          userId: new mongoose.Types.ObjectId("610f94305c3d7d4d3e4ebcb2"),
          itemId: mockedItemId,
          quantity: 1,
        });

      expect(res.status).to.equal(201);
      expect(res.body).to.deep.equal(mockItemUpdated);
    });

    it("assigned quantity to user is less that qunatity requested for checkin", async () => {
      const mockItem = {
        _id: mockedItemId,
        identificationType: "non-unique",
        assignedTo: [
          {
            userId: new mongoose.Types.ObjectId("610f94305c3d7d4d3e4ebcb2"),
            userName: "User",
            quantity: 2,
          },
          {
            userId: new mongoose.Types.ObjectId("610f94305c3d7d4d3e4ebca2"),
            userName: "Another User",
            quantity: 3,
          },
        ],
      };

      sinon.stub(Inventory, "findById").resolves(mockItem);

      const res = await request(app)
        .put("/inventory/checkin")
        .set("Content-Type", "application/json")
        .set("Authorization", "Bearer mocktoken")
        .send({
          userId: new mongoose.Types.ObjectId("610f94305c3d7d4d3e4ebcb2"),
          itemId: mockedItemId,
          quantity: 3,
        });

      expect(res.status).to.equal(400);
    });

    it("If the quantity of items assigned to user becoming zero on checkin", async () => {
      const mockItem = {
        _id: mockedItemId,
        identificationType: "non-unique",
        assignedTo: [
          {
            userId: new mongoose.Types.ObjectId("610f94305c3d7d4d3e4ebcb2"),
            userName: "User",
            quantity: 2,
          },
          {
            userId: new mongoose.Types.ObjectId("610f94305c3d7d4d3e4ebca2"),
            userName: "Another User",
            quantity: 3,
          },
        ],
      };

      const mockItemUpdated = {
        _id: "610f94305c3d7d4d3e4ebcb0",
        identificationType: "unique",
        assignedTo: [
          {
            userId: "610f94305c3d7d4d3e4ebca2",
            userName: "Another User",
            quantity: 3,
          },
        ],
      };

      sinon.stub(Inventory, "findById").resolves(mockItem);
      sinon.stub(Inventory, "findByIdAndUpdate").resolves(mockItemUpdated);

      const res = await request(app)
        .put("/inventory/checkin")
        .set("Content-Type", "application/json")
        .set("Authorization", "Bearer mocktoken")
        .send({
          userId: new mongoose.Types.ObjectId("610f94305c3d7d4d3e4ebcb2"),
          itemId: mockedItemId,
          quantity: 2,
        });

      expect(res.status).to.equal(201);
      expect(res.body).to.deep.equal(mockItemUpdated);
    });

    it("If existing assignement doesn't exist", async () => {
      const mockItem = {
        _id: mockedItemId,
        identificationType: "non-unique",
        assignedTo: [
          {
            userId: new mongoose.Types.ObjectId("610f94305c3d7d4d3e4ebca2"),
            userName: "Another User",
            quantity: 3,
          },
        ],
      };

      sinon.stub(Inventory, "findById").resolves(mockItem);

      const res = await request(app)
        .put("/inventory/checkin")
        .set("Content-Type", "application/json")
        .set("Authorization", "Bearer mocktoken")
        .send({
          userId: new mongoose.Types.ObjectId("610f94305c3d7d4d3e4ebca1"),
          itemId: mockedItemId,
          quantity: 1,
        });

      expect(res.status).to.equal(400);
    });
  });
});
