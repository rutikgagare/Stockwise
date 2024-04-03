const chai = require("chai");
const chaiHttp = require("chai-http");
const sinon = require("sinon");
const jwt = require("jsonwebtoken");
const {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
} = require("@aws-sdk/client-s3");

const app = require("../index.js");
const expect = chai.expect;
chai.use(chaiHttp);

describe("Aws s3 controller", () => {
  afterEach(() => {
    sinon.restore();
  });

  beforeEach(() => {
    const jwtStub = sinon.stub(jwt, "verify");
    jwtStub.resolves("mockId");
  });

  describe("POST /service/upload", () => {
    it("should successfully upload image to aws s3", async () => {
      sinon.stub(S3Client.prototype, "send").resolves({});

      const res = await chai
        .request(app)
        .post("/service/upload")
        .set("Authorization", "Bearer mocktoken")
        .attach("file", "/home/navnath/Downloads/macbook.jpg");

      expect(res).to.have.status(200);
    });

    it("Give error if failed to upload the image", async () => {
      sinon.stub(S3Client.prototype, "send").rejects({});

      const res = await chai
        .request(app)
        .post("/service/upload")
        .set("Authorization", "Bearer mocktoken")
        .attach("file", "/home/navnath/Downloads/macbook.jpg");

      expect(res).to.have.status(500);
    });

    it("If file is not send to request it should give error", async () => {
      sinon.stub(S3Client.prototype, "send").rejects({});

      const res = await chai
        .request(app)
        .post("/service/upload")
        .set("Authorization", "Bearer mocktoken")
        .attach();

      expect(res).to.have.status(500);
    });
  });

  describe("DELETE /service/deleteImage/:key", () => {
    const mockedIMageKey = "Dummy.png";

    it("should successfully delete image from aws s3 bucket", async () => {
      sinon.stub(S3Client.prototype, "send").resolves({});

      const res = await chai
        .request(app)
        .delete(`/service/deleteImage/${mockedIMageKey}`)
        .set("Authorization", "Bearer mocktoken")
        .send();

      expect(res).to.have.status(200);
    });

    it("Give error if failed to delete the image", async () => {
      sinon.stub(S3Client.prototype, "send").rejects({});

      const res = await chai
        .request(app)
        .delete(`/service/deleteImage/${mockedIMageKey}`)
        .set("Authorization", "Bearer mocktoken")
        .send();

      expect(res).to.have.status(500);
    });
  });
});
