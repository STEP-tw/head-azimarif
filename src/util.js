const isNumberGreater = function(number) {
  return function(value) {
    return value > number;
  }
}

const isValueString = function(value) {
  return isNaN(value);
}

const reverseText = function(text) {
  return text.split('').reverse().join('');
}

const identity = function (data) {
  return data;
}

module.exports = {
  isNumberGreater,
  isValueString,
  reverseText,
  identity
}