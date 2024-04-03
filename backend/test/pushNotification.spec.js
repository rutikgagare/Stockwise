const chai = require("chai");
const chaiHttp = require("chai-http");
const sinon = require("sinon");
const jwt = require("jsonwebtoken");
const admin = require("firebase-admin");

const app = require("../index.js");
const sendPushNotification = require("../utils/pushNotification.js");
const expect = chai.expect;
chai.use(chaiHttp);

describe("POST /service/send-push-notification", () => {
  
  const mockedPushToken = "DummyToken";

  afterEach(() => {
    sinon.restore();
  });

  it("should send push notification", async () => { 
    sinon.stub(admin.messaging(), 'send').resolves(true);

    const res = await chai
      .request(app)
      .post("/service/send-push-notification")
      .set("Authorization", "Bearer mocktoken")
      .send({ pushToken: mockedPushToken });

    expect(res).to.have.status(201);
  });

  it("should handle errors during sending pushNotification", async () => {

    sinon.stub(admin.messaging(), 'send').rejects();

    const res = await chai
      .request(app)
      .post("/service/send-push-notification")
      .set("Authorization", "Bearer mocktoken")
      .send({ pushToken: mockedPushToken });

    expect(res).to.have.status(400);
    expect(res.body).to.have.property("error");
  });
});
