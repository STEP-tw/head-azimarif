const {
  isNumberGreater,
  isValueNumber,
  reverseText
} = require("../src/util.js");

const { equal } = require("assert");

describe("isNumberGreater", () => {
  let isGreaterThanFive = isNumberGreater(5);

  it("should return false when number is less than 5", () => {
    equal(isGreaterThanFive(0), false);
  });

  it("should return false when number is same itself", () => {
    equal(isGreaterThanFive(5), false);
  });

  it("should return true when number is greater than 5", () => {
    equal(isGreaterThanFive(6), true);
  });
});

describe("isValueNumber", () => {
  it("should return true when value is an int", () => {
    equal(isValueNumber(0), true);
  });

  it("should return false when value is not an int", () => {
    equal(isValueNumber("a"), false);
  });

  it("should return false when value is some special character", () => {
    equal(isValueNumber("-"), false);
  });
});

describe("reverseText", () => {
  it("should return empty string when input is empty", () => {
    equal(reverseText(''), '');
  });

  it("should return string in reverse order", () => {
    equal(reverseText('End'), 'dnE');
  });
});
