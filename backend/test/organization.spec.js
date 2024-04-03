const chai = require("chai");
const chaiHttp = require("chai-http");
const sinon = require("sinon");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose")
const app = require("../index.js");
const Vendor = require("../models/vendorModel.js");
const Organization = require("../models/organizationModel.js");
const User = require("../models/userModel.js");

const expect = chai.expect;
chai.use(chaiHttp);

describe("Orgnization Controllers", () => {
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

    describe("POST /org/create", () => {
        it("should create a new organization", async () => {
            const org = {
                name: "Mock name",
                email: "mock@email.com",
            }

            const res = await chai
                .request(app)
                .post("/org/create/")
                .set("Authorization", "Bearer mocktoken")
                .send(org)

            expect(res).to.have.status(201);
        })
    })

    describe("POST /org/create", () => {
        it("should fail to create a new organization bacause of lack of data", async () => {
            const org = {
                name: "Mock name",
                email: "mock@email.com",
            }

            const res = await chai
                .request(app)
                .post("/org/create/")
                .set("Authorization", "Bearer mocktoken")
                .send()

            expect(res).to.have.status(400);
        })
    })

    describe("POST /org/create", () => {
        it("should fail to create a new organization bacause of lack of required fields", async () => {
            const org = {
                email: "mock@email.com",
            }

            const res = await chai
                .request(app)
                .post("/org/create/")
                .set("Authorization", "Bearer mocktoken")
                .send()

            expect(res).to.have.status(400);
        })
    })

    describe("POST /org/add", () => {
        it("should add a new employee to the organization", async () => {
            const data = {
                employeeId: "609d22d79c780a2d8fc1ebd2",
                orgId: "660cce8773cab80329c6ea60",
            }

            const res = await chai
                .request(app)
                .post("/org/add/")
                .set("Authorization", "Bearer mocktoken")
                .send(data)

            expect(res).to.have.status(200);
        })
    })

    describe("PUT /org/update", () => {
        it("should update the organization", async () => {
            const data = {
                orgId: "660cce8773cab80329c6ea60",
            }

            const res = await chai
                .request(app)
                .put("/org/update/")
                .set("Authorization", "Bearer mocktoken")
                .send(data)

            expect(res).to.have.status(200);
        })
    })

    describe("POST /org/remove", () => {
        it("should remove the new employee from the organization", async () => {
            const data = {
                employeeId: "609d22d79c780a2d8fc1ebd2",
                orgId: "660cce8773cab80329c6ea60",
            }

            const res = await chai
                .request(app)
                .post("/org/remove/")
                .set("Authorization", "Bearer mocktoken")
                .send(data)

            expect(res).to.have.status(200);
        })
    })

    describe("DELETE /org/deleteOrg", () => {
        it("should delete the organization", async () => {
            const org = await Organization.findOne({});

            const res = await chai
                .request(app)
                .delete("/org/deleteOrg/")
                .set("Authorization", "Bearer mocktoken")
                .send({ orgId: org._id })

            expect(res).to.have.status(200);
        })
    })

    describe("GET /org/employees/:orgId", () => {
        it("should return all the employees of the organization", async () => {
            const org = await Organization.findOne({});

            const res = await chai
                .request(app)
                .get("/org/employees/" + org._id)
                .set("Authorization", "Bearer mocktoken")

            expect(res).to.have.status(200);
        })
    })

    describe("GET /org/getOrg", () => {
        it("should return the organization of the user", async () => {
            const org = await Organization.findOne({});

            const res = await chai
                .request(app)
                .get("/org/getOrg/")
                .set("Authorization", "Bearer mocktoken")

            expect(res).to.have.status(200);
        })
    })
    
    describe("", () => {
        it("", async () => {

        })
    })
})