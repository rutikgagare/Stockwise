const chai = require("chai");

const chaiHttp = require('chai-http');
const app = require('../index');

chai.use(chaiHttp);
const expect = chai.expect;

describe("POST /order/orders", () => {
    it("should return a list of all the orders given by an organization", (done) => {
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
    it("should create an empty order...", (done) => {
        const org = {
            "name": "Google",
            "email": "test@gmail.com",
            "admins": [
                {
                    "$oid": "65e5a72247fc9b7b51dd1882"
                }
            ],
            "employees": [
                {
                    "$oid": "65e82746072233fcb06c116a"
                },
                {
                    "$oid": "65e82763072233fcb06c1176"
                },
                {
                    "$oid": "65e9965bce6e80fc3bac9524"
                },
                {
                    "$oid": "65e9a30fce6e80fc3bac9544"
                },
                {
                    "$oid": "65eaab809aafcd41a1b342bc"
                },
                {
                    "$oid": "65f01b46d9426e72cd62abcb"
                },
                {
                    "$oid": "65f14e00524ac2abc2cc8194"
                },
                {
                    "$oid": "65f160cb63baf1a0c6333e63"
                },
                {
                    "$oid": "65f2b0c9581bb1df8eae52ba"
                },
                {
                    "$oid": "65f2b144581bb1df8eae52c8"
                }
            ],
            "createdAt": {
                "$date": {
                    "$numberLong": "1709549347025"
                }
            },
            "updatedAt": {
                "$date": {
                    "$numberLong": "1710403909084"
                }
            },
            "__v": 10,
            "address": "Hyderabad"
        }

        const admin = {
            "name": "Rutik Gagare",
            "email": "test@gmail.com",
            "password": "$2b$10$ABGCbW1LAPAJWW5BvFciA.8Vjb0jWBRR9peto/bNhldwv9hA.X64e",
            "role": "admin",
            "createdAt": {
                "$date": {
                    "$numberLong": "1710737088569"
                }
            },
            "updatedAt": {
                "$date": {
                    "$numberLong": "1710737088569"
                }
            },
            "__v": 0
        }

        chai.request(app)
            .post("/order/create")
            .send({ org, admin, cart: [] })
            .end((err, res) => {
                expect(res.status).to.be.equal(200);
            })

        done();
    })


});