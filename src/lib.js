const { parseInput } = require("./headInputLib.js");

const {
  isNumberGreater,
  isValueString,
  reverseText,
  identity
} = require("../src/util.js");

const {
  getFileDetails,
  getFileHeading,
  getFileDetailsInReverse
} = require("./fileLib.js");

const runHead = function(fs, inputArgs) {
  let headParameters = parseInput(inputArgs);
  headParameters.option = 'head';

  if (headParameters.type != 'n' && headParameters.type != 'c') {
    return displayUsage(headParameters);
  }

  if (!isCountAboveZero(headParameters.count)) {
    return invalidCountMessage(headParameters);
  }

  let fileDetails = headParameters.files.map(file => getFileDetails(fs, file));
  return runCommand(fileDetails, headParameters);
};

const runTail = function(fs, inputArgs) {
  let tailParameters = parseInput(inputArgs);
  tailParameters.option = 'tail';

  if (tailParameters.type != 'n' && tailParameters.type != 'c') {
    return displayUsage(tailParameters);
  }

  if (isValueString(tailParameters.count)) {
    return invalidCountMessage(tailParameters);
  }

  let fileDetails = tailParameters.files.map(file => getFileDetailsInReverse(fs, file));
  tailParameters.count = Math.abs(tailParameters.count);
  return runCommand(fileDetails, tailParameters);
};

const displayUsage = function(messageParameters) {
  let { type, option } = messageParameters;
  let usageMessage = {
    head: "head: illegal option -- " + type +
      "\nusage: head [-n lines | -c bytes] [file ...]",
    tail: "tail: illegal option -- " + type +
      "\nusage: tail [-F | -f | -r] [-q] [-b # | -c # | -n #] [file ...]"
  };
  return usageMessage[option];
};

const invalidCountMessage = function(messageParameters) {
  let { option, type, count } = messageParameters;
  let invalidMessage = {
    head: {
      n: "head: illegal line count -- " + count,
      c: "head: illegal byte count -- " + count
    },
    tail: {
      n: "tail: illegal offset -- " + count,
      c: "tail: illegal offset -- " + count
    }
  };
  return invalidMessage[option][type];
};

const isCountAboveZero = function(count) {
  let isGreaterThanZero = isNumberGreater(0);
  return isGreaterThanZero(count) && !isValueString(count);
};

const selectOperation = function(headOption) {
  let type = {
    n: getFirstNLines,
    c: getFirstNBytes
  };
  return type[headOption];
};

const selectFileContentOrder = function (option) {
  let type = {
    head: identity,
    tail: reverseText
  }
  return type[option];
}

const runCommand = function (fileDetails, commandValues) {
  let { type, count, option } = commandValues;
  let commandOperation = selectOperation(type);
  let numberOfFiles = fileDetails.length;
  let fileContentOrder = selectFileContentOrder(option);
  return fileDetails.map((fileDetail) => {
    let fileFormatDetails = {
      fileDetail, commandOperation, count, numberOfFiles,
      fileContentOrder
    };
    return getFormattedFileContent(fileFormatDetails);
  }).join('\n\n');
};

const getFormattedFileContent = function (commandValues) {
  let { fileDetail, commandOperation, count,
    numberOfFiles, fileContentOrder } = commandValues;
  if (fileDetail.isExists) {
    let filteredFileContent = '';
    if (numberOfFiles == 1) {
      filteredFileContent = fileContentOrder(commandOperation(fileDetail.content, count));
      return filteredFileContent;
    }
    filteredFileContent = getFileHeading(fileDetail.name);
    filteredFileContent += fileContentOrder(commandOperation(fileDetail.content, count));
    return filteredFileContent;
  }
  return fileDetail.errorMessage;
}

const getFirstNLines = function(content, count) {
  content = content.split("\n");
  return content.slice(0, count).join("\n");
};

const getFirstNBytes = function(content, count) {
  content = content.split("");
  return content.slice(0, count).join("");
};

module.exports = {
  runHead,
  getFirstNLines,
  getFirstNBytes,
  isCountAboveZero,
  invalidCountMessage,
  displayUsage,
  selectOperation,
  runTail,
  runCommand
};