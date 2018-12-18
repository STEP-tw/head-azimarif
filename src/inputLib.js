const { isInteger } = require('../src/util.js');

const parseInput = function (inputArgs) {
  let firstArgument = inputArgs[0];
  if (firstArgument.startsWith('-')) {
    return parseInputWithOption(inputArgs);
  }
  return {
    option: 'n',
    count: 10,
    files: inputArgs
  };
}

const parseInputWithOption = function (inputArgs) {
  let firstArgument = inputArgs[0];
  if (isValidOption(firstArgument)) {
    return {
      option: firstArgument[1],
      count: inputArgs[1],
      files: inputArgs.slice(2)
    };
  }

  if (isInteger(firstArgument)) {
    return {
      option: 'n',
      count: Math.abs(firstArgument),
      files: inputArgs.slice(1)
    };
  }

  return {
    option: firstArgument[1],
    count: firstArgument.slice(2),
    files: inputArgs.slice(1)
  };
}

const isValidOption = function (option) {
  return option === '-n' || option === '-c';
}

module.exports = {
  parseInput,
  parseInputWithOption
}