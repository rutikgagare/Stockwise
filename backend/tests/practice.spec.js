const chai = require("chai");
const expect = chai.expect;
const assert = chai.assert;
const should = chai.should();

// describe: Groups tests and provides a description.
// it: Defines individual test cases.

// Assert
describe("My first test case", function () {
  it("value check 1", () => {
    assert.equal([1, 2, 3].indexOf(4), -1);
  });
  it("value check 2", () => {
    assert.equal([1, 2, 3].indexOf(1), 0);
  });
});

describe("Assert Check", () => {
  let output = "Ok";
  it("check equal", () => {
    assert.equal(output, "Ok");
  });

  let userName = "rutik";
  it("check string", () => {
    assert.typeOf(userName, "string");
  });

  const nums = [1, 2, 3, 4, 5, 6];
  it("check length", () => {
    assert.lengthOf(nums, 6);
  });
});

// should
describe("Should Check", () => {
  let output = "Ok";
  it("check equal", () => {
    output.should.equal("Ok");
  });

  let userName = "rutik";

  it("check string", () => {
    userName.should.be.a("string");
  });

  const nums = [1, 2, 3, 4, 5, 6];
  it("check length", () => {
    nums.should.have.lengthOf(6);
  });
});

// expect
describe("Expect Check", () => {
  let output = "Ok";
  it("check equal", () => {
    expect(output).to.equal("Ok");
  });

  let userName = "rutik";
  it("check string", () => {
    expect(userName).to.be.a("string");
  });

  const nums = [1, 2, 3, 4, 5, 6];
  it("check length", () => {
    expect(nums).to.have.lengthOf(6);
  });

  const user = {
    email: "rutik@gmail.com",
    password: "Test@123",
    address: {
      country: "India",
      phoneNo: ["8888888888", "9999999999"],
    },
  };

  it("check property", () => {
    expect(user).to.have.property("email");
  });

  it("check API object", () => {
    expect(user).to.have.all.keys("email", "password", "address");
  });

  it("check nested fields", () => {
    expect(user).to.have.nested.property("address.country");
  });

  it("check nested field value", () => {
    expect(user).to.have.nested.include({ "address.country": "India" });
  });
});
