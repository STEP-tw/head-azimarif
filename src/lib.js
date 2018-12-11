const { parseInput } = require("./headInputLib.js");

const {
  isNumberGreater,
  isValueNumber,
  reverseText
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

  if (!isValueNumber(tailParameters.count)) {
    return invalidCountMessage(messageParameters);
  }

  let fileDetails = tailParameters.files.map(file => getFileDetailsInReverse(fs, file));
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
  return isGreaterThanZero(count) && isValueNumber(count);
};

const selectOperation = function(headOption) {
  let type = {
    n: getFirstNLines,
    c: getFirstNBytes
  };
  return type[headOption];
};

const head = function(fileDetails, headParameters) {
  let { type, count } = headParameters;
  let headOperation = selectOperation(type);
  let delimiter = "";
  return fileDetails
    .map(fileDetail => {
      if (fileDetail.isExists) {
        let currentHeadFile = "";
        if (fileDetails.length > 1) {
          currentHeadFile = delimiter + getFileHeading(fileDetail.name);
          delimiter = "\n";
        }
        currentHeadFile += headOperation(fileDetail.content, count);
        return currentHeadFile;
      }
      return fileDetail.errorMessage;
    })
    .join("\n");
};

const tail = function(fileDetails, tailParameters) {
  let type = tailParameters.type;
  let count = Math.abs(tailParameters.count);
  let tailOperation = selectOperation(type);
  let delimiter = "";
  return fileDetails
    .map(fileDetail => {
      if (fileDetail.isExists) {
        let currentTailFile = "";
        if (fileDetails.length > 1) {
          currentTailFile = delimiter + getFileHeading(fileDetail.name);
          delimiter = "\n";
        }
        currentTailFile += reverseText(
          tailOperation(fileDetail.content, count)
        );
        return currentTailFile;
      }
      return fileDetail.errorMessage;
    })
    .join("\n");
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
  runTail
};
