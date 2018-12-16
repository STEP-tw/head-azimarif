const parseInput = function (arguments) {
  let firstArgument = arguments[0];
  if (firstArgument[0] == '-') {
    return getOptionDetails(arguments);
  }
  return {
    type: 'n',
    count: 10,
    files: arguments
  };
}

const getOptionDetails = function (optionArguments) {
  let firstArgument = optionArguments[0];
  if (isValidOption(firstArgument)) {
    return {
      type: firstArgument[1],
      count: optionArguments[1],
      files: optionArguments.slice(2)
    };
  }

  if (!isNaN(firstArgument)) {
    return {
      type: 'n',
      count: Math.abs(firstArgument),
      files: optionArguments.slice(1)
    };
  }

  return {
    type: firstArgument[1],
    count: firstArgument.slice(2),
    files: optionArguments.slice(1)
  };
}

const isValidOption = function (option) {
  return option == '-n' || option == '-c';
}

module.exports = {
  parseInput,
  getOptionDetails
}