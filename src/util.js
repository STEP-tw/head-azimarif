const isNumberGreater = function(number) {
  return function(value) {
    return value > number;
  }
}

const isNumber = function(value) {
  return !isNaN(value);
}

const reverseText = function(text) {
  return text.split('').reverse().join('');
}

const identity = function (data) {
  return data;
}

module.exports = {
  isNumberGreater,
  isNumber,
  reverseText,
  identity
}