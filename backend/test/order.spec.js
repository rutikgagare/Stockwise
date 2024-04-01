const chai = require("chai");

const chaiHttp = require('chai-http');
const app = require('../index');

chai.use(chaiHttp);
const expect = chai.expect;

const Organization = require("../models/organizationModel")
const mongoose = require("mongoose");
require("dotenv").config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to the database…"))
  .catch((err) => console.error("Connection error:", err));


describe("POST /order/orders", () => {
    it("should should return a list of all the orders given by an organization", (done) => {
        chai.request(app)
            .post("/order/orders")
            .send({
                orgId: "65f316a1991edde66ee55fc1" // get orgId dynamically...
            })
            .end((err, res) => {
                expect(res.status).to.be.equal(200);
                // more assertions goes here...
                // ...
            })
            
        done();
    })
    

});

describe("POST /order/create", () => {
    it("should should return a list of all the orders given by an organization", async (done) => {
        const org = Organization.findOne();
        const admin = User.findOne();
        chai.request(app)
            .post("/order/create")
            .send({
                org, admin, cart
            })
            .end((err, res) => {
                expect(res.status).to.be.equal(200);
                // more assertions goes here...
                // ...
            })
            
        done();
    })

});