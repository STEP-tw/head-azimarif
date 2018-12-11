const {
  isNumberGreater
} = require('../src/util.js');
const {
  equal
} = require('assert');

describe('isNumberGreater', () => {
  let isGreaterThanFive = isNumberGreater(5);

  it('should return false when number is less than 5', () => {
    equal(isGreaterThanFive(0), false);
  });

  it('should return false when number is same itself', () => {
    equal(isGreaterThanFive(5), false);
  });

  it('should return true when number is greater than 5', () => {
    equal(isGreaterThanFive(6), true);
  });
});
