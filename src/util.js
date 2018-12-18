const isNaturalNumber = function (number) {
  return number > 0 && number % 1 == 0;
}

const isNumber = function (value) {
  return !isNaN(value);
}

const reverseText = function (text) {
  return text.split('').reverse().join('');
}

const identity = function (data) {
  return data;
}

module.exports = {
  isNaturalNumber,
  isNumber,
  reverseText,
  identity
}