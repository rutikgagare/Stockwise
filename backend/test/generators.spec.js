const chai = require("chai");
const expect = chai.expect;

const { generateRandomPassword } = require("../utils/generators")
describe("generator functions", () => {
    it("Should succesfully generate a 12 character strong random password", () => {
        const generatedPassword = generateRandomPassword();
        expect(generatedPassword).to.have.length(12)
    })
})