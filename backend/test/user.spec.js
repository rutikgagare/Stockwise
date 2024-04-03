const chai = require("chai");

const chaiHttp = require('chai-http');
const app = require('../index');

chai.use(chaiHttp);
const expect = chai.expect;

const Organization = require("../models/organizationModel");
const User = require("../models/userModel");

describe("User routes", () => {

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

    describe("GET /user/getAllUsers/", () => {

        it("Should return list of all the users", async () => {
            const res = await chai
                .request(app)
                .get("/user/getAllUsers/")

            expect(res).to.have.status(200)
        })
    })

    describe("GET /user/getUser/:id", async () => {
        it("should return the user given the userId", async () => {
            const u = await User.findOne({})
            const res = await chai
                .request(app)
                .get("/user/getUser/" + u._id.toString())

            expect(res).to.have.status(200)
        })
    })

    describe("POST user/createUser/", () => {
        it("should create a new user", async () => {
            const u = {
                name: "mock user",
                email: "mock@mockmail.mockmock" + Math.round(Math.random() * 10000),
                password: "verystrongmockpassword"
            }

            const res = await chai
                .request(app)
                .post("/user/createUser/")
                .send(u)

            expect(res).to.have.status(200)
        })
    })

    describe("PUT user/createUser/", () => {
        it("should upate the user", async () => {
            const u = await User.findOne({})
            const user = {
                _id: u._id.toString(),
                name: "mock user",
                email: "mock@mockmail.mockmock" + Math.round(Math.random() * 10000),
                password: "verystrongmockpassword"
            }

            const res = await chai
                .request(app)
                .put("/user/updateUser/")
                .send(user)

            expect(res).to.have.status(200)
        })
    })

    describe("DELETE /user/deleteUser", () => {
        it("", async () => {
            const u = await User.findOne({});
            const res = await chai
                .request(app)
                .delete("/user/deleteUser/")
                .send({ _id: u._id })
        })
    })

    describe("", () => {
        it("", async () => {

        })
    })

})