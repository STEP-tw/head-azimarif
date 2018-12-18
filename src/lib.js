const { parseInput } = require("./inputLib.js");

const {
  isNumberGreater,
  isNumber,
  reverseText,
  identity
} = require("../src/util.js");

const {
  getFileDetails,
  getFileHeading,
  getFileDetailsInReverse
} = require("./fileLib.js");

const isInvalidOption = function(option) {
  return option != 'n' && option != 'c';
}

const head = function(fs, inputArgs) {
  let headParameters = parseInput(inputArgs);
  headParameters.command = 'head';

  if (isInvalidOption(headParameters.type)) {
    return displayUsage(headParameters);
  }

  if (!isCountAboveZero(headParameters.count)) {
    return invalidCountMessage(headParameters);
  }

  let filesDetail = headParameters.files.map(file => getFileDetails(file, fs));
  return runCommand(filesDetail, headParameters);
};

const tail = function(fs, inputArgs) {
  let tailParameters = parseInput(inputArgs);
  tailParameters.command = 'tail';

  if (isInvalidOption(tailParameters.type)) {
    return displayUsage(tailParameters);
  }

  if (!isNumber(tailParameters.count)) {
    return invalidCountMessage(tailParameters);
  }

  let filesDetail = tailParameters.files.map(file => getFileDetailsInReverse(file, fs));
  tailParameters.count = Math.abs(tailParameters.count);
  return runCommand(filesDetail, tailParameters);
};

const displayUsage = function(messageParameters) {
  let { type, command } = messageParameters;
  let usageMessage = {
    head: "head: illegal option -- " + type +
      "\nusage: head [-n lines | -c bytes] [file ...]",
    tail: "tail: illegal option -- " + type +
      "\nusage: tail [-F | -f | -r] [-q] [-b # | -c # | -n #] [file ...]"
  };
  return usageMessage[command];
};

const invalidCountMessage = function(messageParameters) {
  let { command, type, count } = messageParameters;
  let invalidOffsetMessage = "tail: illegal offset -- " + count;
  let invalidMessage = {
    head: {
      n: "head: illegal line count -- " + count,
      c: "head: illegal byte count -- " + count
    },
    tail: {
      n: invalidOffsetMessage,
      c: invalidOffsetMessage
    }
  };
  return invalidMessage[command][type];
};

const isCountAboveZero = function(count) {
  let isGreaterThanZero = isNumberGreater(0);
  return isGreaterThanZero(count);
};

const selectOperation = function(headOption) {
  let type = {
    n: getFirstNLines,
    c: getFirstNBytes
  };
  return type[headOption];
};

const selectFileContentOrder = function (commandName) {
  let command = {
    head: identity,
    tail: reverseText
  }
  return command[commandName];
}

const runCommand = function (filesDetail, commandValues) {
  let { type, count, command } = commandValues;
  let commandOperation = selectOperation(type);
  let numberOfFiles = filesDetail.length;
  let fileContentOrder = selectFileContentOrder(command);
  return filesDetail.map((fileDetail) => {
    let fileFormatDetails = {
      fileDetail, commandOperation, count, numberOfFiles,
      fileContentOrder
    };
    return getFormattedFileContent(fileFormatDetails);
  }).join('\n\n');
};

const getFormattedFileContent = function (fileFormatDetails) {
  let { fileDetail, commandOperation, count,
    numberOfFiles, fileContentOrder } = fileFormatDetails;
  if (fileDetail.isExists) {
    let filteredFileContent = '';
    let fileContent = fileContentOrder(commandOperation(fileDetail.content, count));
    if (numberOfFiles == 1) {
      filteredFileContent = fileContent;
      return filteredFileContent;
    }
    filteredFileContent = getFileHeading(fileDetail.name);
    filteredFileContent += fileContent;
    return filteredFileContent;
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
  isCountAboveZero,
  invalidCountMessage,
  displayUsage,
  selectOperation,
  tail,
  runCommand,
  selectFileContentOrder,
  isInvalidOption
};