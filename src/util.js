const isNumberGreater = function(number) {
  return function(value) {
    return value > number;
  }
}

const isNaturalNumber = function(value) {
  let isGreaterThanZero = isNumberGreater(0);
  return !isNaN(value) && isGreaterThanZero(value);
}

const reverseText = function(text) {
  return text.split('').reverse().join('');
}

const identity = function (data) {
  return data;
}

module.exports = {
  isNumberGreater,
  isNaturalNumber,
  reverseText,
  identity
}