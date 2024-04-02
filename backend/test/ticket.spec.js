const chai = require("chai");
const chaiHttp = require("chai-http");
const sinon = require("sinon");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const app = require("../index.js");
const User = require("../models/userModel.js");
const Ticket = require("../models/ticketModel.js");

const expect = chai.expect;
chai.use(chaiHttp);

describe("Ticket controller", () => {
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

  const mockedTicket = {
    issueType: "Bug",
    description: "Example description",
    priority: "High",
    assetId: "607afd5f6f75b123456789ab",
    orgId: "607afd5f6f75b123456789ab",
  };

  const mockedTicket1 = {
    _id: "607afd5f6f75b12345678912",
    issueType: "Bug",
    description: "Example description",
    priority: "High",
    assetId: "607afd5f6f75b123456789ab",
    orgId: "607afd5f6f75b123456789ab",
    createdBy: "607afd5f6f75b123456789ab",
  };

  const mockedTicketArray = [
    {
      _id: "607afd5f6f75b12345678912",
      issueType: "Bug",
      description: "Example description",
      priority: "High",
      assetId: "607afd5f6f75b123456789ab",
      orgId: "607afd5f6f75b123456789ab",
      createdBy: "607afd5f6f75b123456789ab",
      createdAt: new Date("2023-03-15T10:00:00Z"),
    },
    {
      _id: "607afd5f6f75b123456789ab",
      issueType: "Feature",
      description: "Another example description",
      priority: "Low",
      assetId: "607afd5f6f75b123456789cd",
      orgId: "607afd5f6f75b123456789cd",
      createdBy: "607afd5f6f75b123456789cd",
      createdAt: new Date("2023-03-16T12:00:00Z"),
    },
  ];

  describe("POST /ticket/create", () => {
    it("Should create a ticket", async () => {
      sinon.stub(Ticket.prototype, "save").resolves(mockedTicket1);

      const res = await chai
        .request(app)
        .post("/ticket/create")
        .set("Authorization", "Bearer mocktoken")
        .send(mockedTicket);

      expect(res).to.have.status(201);
      expect(res.body).to.deep.equal(mockedTicket1);
    });

    it("Shouldn't create a ticket", async () => {
      sinon.stub(Ticket.prototype, "save").throws(new Error());

      const res = await chai
        .request(app)
        .post("/ticket/create")
        .set("Authorization", "Bearer mocktoken")
        .send(mockedTicket);

      expect(res).to.have.status(400);
      expect(res.body).to.have.property("message");
    });
  });

  describe("PUT /ticket/update", () => {
    it("Should update a ticket", async () => {
      sinon.stub(Ticket, "findByIdAndUpdate").resolves(mockedTicket1);

      const res = await chai
        .request(app)
        .put("/ticket/update")
        .set("Authorization", "Bearer mocktoken")
        .send(mockedTicket);

      expect(res).to.have.status(201);
      expect(res.body).to.deep.equal(mockedTicket1);
    });

    it("Shouldn't update a ticket and throw error id id doesn't exist", async () => {
      sinon.stub(Ticket, "findByIdAndUpdate").throws(new Error());

      const res = await chai
        .request(app)
        .put("/ticket/update")
        .set("Authorization", "Bearer mocktoken")
        .send(mockedTicket);

      expect(res).to.have.status(400);
      expect(res.body).to.have.property("message");
    });
  });

  describe("GET /ticket/userTickets", () => {
    it("Get all my tickets", async () => {
      sinon.stub(Ticket, "find").resolves(mockedTicket1);

      const res = await chai
        .request(app)
        .get("/ticket/userTickets")
        .set("Authorization", "Bearer mocktoken")
        .send();

      expect(res).to.have.status(201);
    });

    it("Shouldn't get ticket if error occured dring find", async () => {
      sinon.stub(Ticket, "find").throws(new Error());

      const res = await chai
        .request(app)
        .get("/ticket/userTickets")
        .set("Authorization", "Bearer mocktoken")
        .send();

      expect(res).to.have.status(400);
      expect(res.body).to.have.property("message");
    });

    it("Should give error if ticket is not found", async () => {
      sinon.stub(Ticket, "find").resolves(null);

      const res = await chai
        .request(app)
        .get("/ticket/userTickets")
        .set("Authorization", "Bearer mocktoken")
        .send();

      expect(res).to.have.status(400);
      expect(res.body).to.have.property("message");
    });
  });

  describe("GET /ticket/:orgId", () => {
    const mockedOrgId = "607afd5f6f75b123456789ab";

    const mockedTicketArraySorted = [
      {
        _id: "607afd5f6f75b123456789ab",
        issueType: "Feature",
        description: "Another example description",
        priority: "Low",
        assetId: "607afd5f6f75b123456789cd",
        orgId: "607afd5f6f75b123456789cd",
        createdBy: "607afd5f6f75b123456789cd",
        createdAt: "2023-03-16T12:00:00.000Z",
      },
      {
        _id: "607afd5f6f75b12345678912",
        issueType: "Bug",
        description: "Example description",
        priority: "High",
        assetId: "607afd5f6f75b123456789ab",
        orgId: "607afd5f6f75b123456789ab",
        createdBy: "607afd5f6f75b123456789ab",
        createdAt: "2023-03-15T10:00:00.000Z"
      },
    ];

    it("Get all tickets if orgId exist", async () => {
      sinon.stub(Ticket, "find").resolves(mockedTicketArray);

      const res = await chai
        .request(app)
        .get(`/ticket/${mockedOrgId}`)
        .set("Authorization", "Bearer mocktoken")
        .send();

      expect(res).to.have.status(201);
      expect(res.body).to.deep.equal(mockedTicketArraySorted);
    });

    it("Shouldn't get ticket if error occured dring find", async () => {
      sinon.stub(Ticket, "find").throws(new Error());

      const res = await chai
        .request(app)
        .get("/ticket/607afd5f6f75b123456789ab")
        .set("Authorization", "Bearer mocktoken")
        .send();

      expect(res).to.have.status(400);
      expect(res.body).to.have.property("message");
    });

    it("Should give error if ticket is not found", async () => {
      sinon.stub(Ticket, "find").resolves(null);

      const res = await chai
        .request(app)
        .get("/ticket/607afd5f6f75b123456789ab")
        .set("Authorization", "Bearer mocktoken")
        .send();

      expect(res).to.have.status(400);
      expect(res.body).to.have.property("message");
    });
  });
});
