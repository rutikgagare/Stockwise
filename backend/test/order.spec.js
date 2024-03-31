const chai = require("chai");

const chaiHttp = require('chai-http');
const app = require('../index');

chai.use(chaiHttp);
const expect = chai.expect;

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