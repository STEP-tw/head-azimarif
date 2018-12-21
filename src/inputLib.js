const parseInput = function (inputArgs) {
  let firstArgument = inputArgs[0];
  if (hasDash(firstArgument)) {
    return parseInputWithOption(inputArgs);
  }
  return createParameterObject('n', 10, inputArgs);
}

const parseInputWithOption = function (inputArgs) {
  let firstArgument = inputArgs[0];
  if (isValidOption(firstArgument)) {
    return createParameterObject(firstArgument[1], inputArgs[1], inputArgs.slice(2));
  }

  if (!isNaN(firstArgument)) {
    return createParameterObject('n', Math.abs(firstArgument), inputArgs.slice(1));
  }
  
  return createParameterObject(firstArgument[1], firstArgument.slice(2), inputArgs.slice(1));
}

const isValidOption = function (option) {
  return option === '-n' || option === '-c';
}

const hasDash = function (option) {
  return option.startsWith('-');
}

const createParameterObject = function (option, count, files) {
  return { option, count, files };
}

module.exports = {
  parseInput,
  parseInputWithOption,
  isValidOption,
  hasDash
}