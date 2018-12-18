const { parseInput } = require("./inputLib.js");

const {
  isNaturalNumber,
  isInteger,
  reverseText,
  identity
} = require("../src/util.js");

const {
  getFileDetails,
  getFileHeading,
  getFileDetailsInReverse
} = require("./fileLib.js");

const { displayUsage, invalidCountMessage } = require('./errorLib.js');

const isInvalidOption = function(option) {
  return option != 'n' && option != 'c';
}

const head = function(inputArgs, fs) {
  let headParameters = parseInput(inputArgs);
  headParameters.command = 'head';

  if (isInvalidOption(headParameters.option)) {
    return displayUsage(headParameters);
  }

  if (!isNaturalNumber(headParameters.count)) {
    return invalidCountMessage(headParameters);
  }

  let filesDetail = headParameters.files.map(file => getFileDetails(file, fs));
  return runCommand(filesDetail, headParameters);
};

const tail = function(inputArgs, fs) {
  let tailParameters = parseInput(inputArgs);
  tailParameters.command = 'tail';

  if (isInvalidOption(tailParameters.option)) {
    return displayUsage(tailParameters);
  }

  if (!isInteger(tailParameters.count)) {
    return invalidCountMessage(tailParameters);
  }

  let filesDetail = tailParameters.files.map(file => getFileDetailsInReverse(file, fs));
  tailParameters.count = Math.abs(tailParameters.count);
  return runCommand(filesDetail, tailParameters);
};

const selectOperation = function(headOption) {
  let option = {
    n: getFirstNLines,
    c: getFirstNBytes
  };
  return option[headOption];
};

const selectFileContentOrder = function (commandName) {
  let command = {
    head: identity,
    tail: reverseText
  }
  return command[commandName];
}

const runCommand = function (filesDetail, commandValues) {
  let { option, count, command } = commandValues;
  let commandOperation = selectOperation(option);
  let numberOfFiles = filesDetail.length;
  let fileContentOrder = selectFileContentOrder(command);
  return filesDetail.map((fileDetail) => {
    let fileFormatDetails = {
      fileDetail, commandOperation, count, numberOfFiles,
      fileContentOrder
    };
    return extractFileContent(fileFormatDetails);
  }).join('\n\n');
};

const extractFileContent = function ({ fileDetail, commandOperation, count,
  numberOfFiles, fileContentOrder }) {
  if (fileDetail.isExists) {
    let requiredFileContent = '';
    let fileContent = commandOperation(fileDetail.content, count);
    let actaulFileContent = fileContentOrder(fileContent);

    if (numberOfFiles === 1) {
      requiredFileContent = actaulFileContent;
      return requiredFileContent;
    }
    requiredFileContent = getFileHeading(fileDetail.name);
    requiredFileContent += actaulFileContent;
    return requiredFileContent;
  }
  return fileDetail.errorMessage;
}

const getFirstNLines = function(content, count) {
  let contentArray = content.split("\n");
  return contentArray.slice(0, count).join("\n");
};

const getFirstNBytes = function(content, count) {
  let contentArray = content.split("");
  return contentArray.slice(0, count).join("");
};

module.exports = {
  head,
  getFirstNLines,
  getFirstNBytes,
  selectOperation,
  tail,
  runCommand,
  selectFileContentOrder,
  isInvalidOption
};