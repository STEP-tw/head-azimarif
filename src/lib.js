const { parseInput } = require("./inputLib.js");

const {
  reverseText,
  identity,
  isInteger,
  isNaturalNumber 
} = require("../src/util.js");

const {
  getFileDetails,
  getFileHeading,
  getFileDetailsInReverse,
  getFileContentWithHeading,
  getFileContentWithoutHeading
} = require("./fileLib.js");

const { displayUsage, invalidCountMessage } = require("./errorLib.js");

const head = function (inputArgs, fs) {
  let headParameters = parseInput(inputArgs);
  headParameters.command = 'head';
  let error = validateOptionArgs(headParameters);
  if (error != '') {
    return error;
  }

  let filesDetail = headParameters.files.map(file => getFileDetails(file, fs));
  return runCommand(filesDetail, headParameters);
};

const tail = function(inputArgs, fs) {
  let tailParameters = parseInput(inputArgs);
  tailParameters.command = 'tail';

  let error = validateOptionArgs(tailParameters);
  if(error != ''){
    return error;
  }

  let filesDetail = tailParameters.files.map(file => getFileDetailsInReverse(file, fs));
  tailParameters.count = Math.abs(tailParameters.count);
  return runCommand(filesDetail, tailParameters);
};

const validateOptionArgs = function (optionArguments) {
  let invalidCount = {
    head: isNaturalNumber,
    tail: isInteger
  }
  let { command, option, count } = optionArguments;
  let invalidCountChecker = invalidCount[command];
  if (isInvalidOption(option)) {
    return displayUsage(optionArguments);
  }

  if (!invalidCountChecker(count)) {
    return invalidCountMessage(optionArguments);
  }
  return '';
}

const isInvalidOption = function(option) {
  return option != 'n' && option != 'c';
}

const runCommand = function (filesDetail, commandValues) {
  let { option, count, command } = commandValues;
  let commandOperation = selectOperation(option);
  let fileContentOrder = selectFileContentOrder(command);
  let formatter = getFileContentWithoutHeading;
  
  let numberOfFiles = filesDetail.length;
  if (numberOfFiles > 1){
    formatter = getFileContentWithHeading;
  }
  return filesDetail.map((fileDetail) => {
    let fileFormatDetails = {
      fileDetail, commandOperation, count, formatter,
      fileContentOrder
    };
    return extractFileContent(fileFormatDetails);
  }).join('\n\n');
};

const selectOperation = function(selectedOption) {
  let option = {
    n: getFirstNLines,
    c: getFirstNBytes
  };
  return option[selectedOption];
};

const getFirstNLines = function(content, numberOfLines) {
  let contentArray = content.split("\n");
  return contentArray.slice(0, numberOfLines).join("\n");
};

const getFirstNBytes = function(content, numberOfBytes) {
  let contentArray = content.split("");
  return contentArray.slice(0, numberOfBytes).join("");
};

const selectFileContentOrder = function (selectedCommand) {
  let command = {
    head: identity,
    tail: reverseText
  }
  return command[selectedCommand];
}

const extractFileContent = function ({ fileDetail, commandOperation, count,
  formatter, fileContentOrder }) {
  if (fileDetail.isExists) {
    let fileContent = commandOperation(fileDetail.content, count);
    let requiredFileContent = fileContentOrder(fileContent);
    return formatter(fileDetail.name, requiredFileContent);
  }
  return fileDetail.errorMessage;
}

module.exports = {
  head,
  getFirstNLines,
  getFirstNBytes,
  selectOperation,
  tail,
  runCommand,
  selectFileContentOrder,
  validateOptionArgs,
  isInvalidOption
};