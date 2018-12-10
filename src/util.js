const isNumberGreater = function(number) {
  return function(value) {
    return value > number;
  }
}

const isValueNumber = function(value) {
  return !isNaN(value);
}

module.exports = {
  isNumberGreater,
  isValueNumber
}