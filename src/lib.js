const { parseInput } = require("./headInputLib.js");

const {
  isNumberGreater,
  isNaturalNumber,
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

  let messageParameters = {
    type: headParameters.type,
    count: headParameters.count,
    option: 'head'
  };

  if (headParameters.type != 'n' && headParameters.type != 'c') {
    return displayUsage(messageParameters);
  }

  if (!isCountAboveZero(headParameters.count)) {
    return invalidCountMessage(messageParameters);
  }

  let fileDetails = headParameters.files.map(file => getFileDetails(fs, file));
  return head(fileDetails, headParameters);
};

const runTail = function(fs, inputArgs) {
  let tailParameters = parseInput(inputArgs);
  let messageParameters = {
    type: tailParameters.type,
    count: tailParameters.count,
    option: 'tail'
  };

  if (tailParameters.type != 'n' && tailParameters.type != 'c') {
    return displayUsage(messageParameters);
  }

  if (!isNaturalNumber(tailParameters.count)) {
    return invalidCountMessage(messageParameters);
  }

  let fileDetails = tailParameters.files.map(file => getFileDetailsInReverse(fs, file));
  tailParameters.count = Math.abs(tailParameters.count);
  return tail(fileDetails, tailParameters);
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
  return isGreaterThanZero(count) && isNaturalNumber(count);
};

const selectOperation = function(headOption) {
  let type = {
    n: getFirstNLines,
    c: getFirstNBytes
  };
  return type[headOption];
};

const head = function (fileDetails, headParameters) {
  let { type, count } = headParameters;
  let commandOperation = selectOperation(type);
  let numberOfFiles = fileDetails.length;
  return fileDetails.map((fileDetail) => {
    let commandValues = {
      fileDetail, commandOperation, count, numberOfFiles,
      contentOrder: identity
    };
    return runCommand(commandValues);
  }).join('\n\n');
};

const runCommand = function (commandValues) {
  let { fileDetail, commandOperation, count,
    numberOfFiles, contentOrder } = commandValues;
  if (fileDetail.isExists) {
    let filteredFileContent = '';
    if (numberOfFiles == 1) {
      filteredFileContent = contentOrder(commandOperation(fileDetail.content, count));
      return filteredFileContent;
    }
    filteredFileContent = getFileHeading(fileDetail.name);
    filteredFileContent += contentOrder(commandOperation(fileDetail.content, count));
    return filteredFileContent;
  }
  return fileDetail.errorMessage;
}

const tail = function (fileDetails, tailParameters) {
  let { type, count } = tailParameters;
  let commandOperation = selectOperation(type);
  let numberOfFiles = fileDetails.length;
  return fileDetails.map((fileDetail) => {
    let commandValues = {
      fileDetail, commandOperation, count,
      numberOfFiles, contentOrder: reverseText
    };
    return runCommand(commandValues);
  }).join('\n\n');
};

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
  head,
  getFirstNLines,
  getFirstNBytes,
  isCountAboveZero,
  invalidCountMessage,
  displayUsage,
  selectOperation,
  runTail,
  tail
};
