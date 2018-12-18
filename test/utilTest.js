const {
  isNumberGreater,
  isNumber,
  reverseText,
  identity
} = require("../src/util.js");

const assert = require("assert");

describe("isNumberGreater", () => {
  let isGreaterThanFive = isNumberGreater(5);

  it("should return false when number is less than 5", () => {
    assert.equal(isGreaterThanFive(0), false);
  });

  it("should return false when number is same itself", () => {
    assert.equal(isGreaterThanFive(5), false);
  });

  it("should return true when number is greater than 5", () => {
    assert.equal(isGreaterThanFive(6), true);
  });

  it("should return false when string is given", () => {
    assert.equal(isGreaterThanFive(''), false);
  });
});

describe("isNumber", () => {
  it("should return true when positive value is given", () => {
    assert.equal(isNumber(0), true);
  });

  it("should return true when negative value is given", () => {
    assert.equal(isNumber(-1), true);
  });

  it("should return false when value is not an int", () => {
    assert.equal(isNumber("a"), false);
  });

  it("should return false when value is some special character", () => {
    assert.equal(isNumber("-"), false);
  });
});

describe("reverseText", () => {
  it("should return empty string when input is empty", () => {
    assert.equal(reverseText(""), "");
  });

  it("should return string in reverse order", () => {
    assert.equal(reverseText("End"), "dnE");
  });
});

describe("identity", () => {
  it("should return empty string when input is empty", () => {
    assert.equal(identity(""), "");
  });

  it("should return string as it is", () => {
    assert.equal(identity("End"), "End");
  });
});
