const chai = require("chai");
const chaiHttp = require("chai-http");
const sinon = require("sinon");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose")
const app = require("../index.js");
const Vendor = require("../models/vendorModel.js");
const Organization = require("../models/organizationModel.js");

const expect = chai.expect;
chai.use(chaiHttp);

describe("Vendor Controllers", () => {
    afterEach(() => {
        sinon.restore();
    });

    beforeEach(() => {
        const jwtStub = sinon.stub(jwt, "verify");
        jwtStub.resolves("mockId");
        sinon.stub(Vendor, "findOne").resolves({});
    });

    describe("POST /vendor/vendors", () => {
        it("should return the list of vendors of an organization", async () => {
            const mockOrganization = {
                _id: "65f316a1991edde66ee55fc1",
                name: "Mock Organization",
                email: "test@gmail.com",
                admins: [],
                employees: [],
            };

            sinon.stub(Organization, "findById").resolves(mockOrganization);

            const res = await chai
                .request(app)
                .post("/vendor/vendors")
                .send({
                    orgId: "65f316a1991edde66ee55fc1",
                });

            expect(res).to.have.status(200);
        });
    })

    describe("POST /vendor/create", () => {
        it("should create a new vendor", async () => {
            const mockVendor = {
                name: "Mock Vendor",
                address: "Mock street, Mock, Mock, Mock.",
                email: "mock@mockmail.mockmock",
                phone: "779983647",
                orgId: "65f316a1991edde66ee55fc1",

            }
            // sinon.stub(Vendor, "insertOne").resolves(mockVendor);
            
            const res = await chai
            .request(app)
            .post("/vendor/create")
            .send(mockVendor)
            
            expect(res).to.have.status(201);
        })
    })

    describe("PUT /vendor/update", () => {
        it("should update the vendor", async () => {
            const mockVendor = {
                name: "Mock Vendor Updated",
                address: "Mock street, Updated, Mock, Mock.",
                email: "mock@mockmail.mockmock",
                phone: "776942047",
                orgId: "65f316a1991edde66ee55fc1",

            }
            // sinon.stub(Vendor, "insertOne").resolves(mockVendor);
            
            const res = await chai
            .request(app)
            .put("/vendor/update")
            .send(mockVendor)
            
            expect(res).to.have.status(200);
        })
    })

    describe("DELETE /vendor/delete", () => {
        it("Should delete the given vendor", async () => {
            const vendorToDelete = await Vendor.findOne();
            const res = await chai
                .request(app)
                .delete("/vendor/delete")
                .send({ vendorId: vendorToDelete._id || "660cd1c80bf90c2bcafe755a" })

            expect(res).to.have.status(200)
        })


    // const res = await chai
    //     .request(app)
    //     .delete("/inventory/delete")
    //     .set("Authorization", "Bearer mocktoken")
    //     .send({ itemId: mockedItemId });
    })
})