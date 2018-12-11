const isNumberGreater = function(number) {
  return function(value) {
    return value > number;
  }
}

const isValueNumber = function(value) {
  return !isNaN(value);
}

const reverseText = function(text) {
  return text.split('').reverse().join('');
}

module.exports = {
  isNumberGreater,
  isValueNumber,
  reverseText
}