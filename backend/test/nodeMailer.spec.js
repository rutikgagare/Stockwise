const chai = require("chai");
const chaiHttp = require("chai-http");
const sinon = require("sinon");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const app = require("../index.js");
const expect = chai.expect;
chai.use(chaiHttp);

describe("NodeMailer Controllers", () => {
  afterEach(() => {
    sinon.restore();
  });

  beforeEach(() => {
    const jwtStub = sinon.stub(jwt, "verify");
    jwtStub.resolves("mockId");
  });

  const mockedEmailDetails = {
    userEmail: "recipient@example.com",
    messageContent: "This is a test message.",
    itemImage: "example.jpg",
    subject: "Test Subject",
  };

  const mockedEmailDetails1 = {
    userEmail: "recipient@example.com",
    messageContent: "This is a test message.",
    itemImage: "example.jpg",
  };

  describe("POST /service/sendMail", () => {
    it("should send mail successfully", async () => {
      const transporterStub = sinon.stub(nodemailer, "createTransport").returns({
        sendMail: sinon.stub().resolves(true)
      });

      const res = await chai
        .request(app)
        .post("/service/sendMail")
        .set("Authorization", "Bearer mocktoken")
        .send(mockedEmailDetails);

      expect(res).to.have.status(201);

      transporterStub.restore();
    });

    it("should send mail successfully when mail subject not provided with default subject", async () => {
        const transporterStub = sinon.stub(nodemailer, "createTransport").returns({
          sendMail: sinon.stub().resolves(true)
        });
  
        const res = await chai
          .request(app)
          .post("/service/sendMail")
          .set("Authorization", "Bearer mocktoken")
          .send(mockedEmailDetails1);
  
        expect(res).to.have.status(201);
  
        transporterStub.restore();
      });

    it("should handle errors during sending mail", async () => {

      const transporterStub = sinon.stub(nodemailer, "createTransport").returns({
        sendMail: sinon.stub().rejects(new Error())
      });

      const res = await chai
        .request(app)
        .post("/service/sendMail")
        .set("Authorization", "Bearer mocktoken")
        .send(mockedEmailDetails);

      expect(res).to.have.status(400);
      expect(res.body).to.have.property("message");
      transporterStub.restore();
    });
  });
});
