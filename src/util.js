const isNaturalNumber = function (number) {
  return number > 0 && number % 1 === 0;
}

const isInteger = function (number) {
  return !isNaN(number) && number % 1 === 0;
}

const reverseText = function (text) {
  return text.split('').reverse().join('');
}

const identity = function (data) {
  return data;
}

module.exports = {
  isNaturalNumber,
  isInteger,
  reverseText,
  identity
}