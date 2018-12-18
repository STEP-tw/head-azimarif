const { parseInput } = require("./inputLib.js");

const { reverseText, identity } = require("../src/util.js");

const {
  getFileDetails,
  getFileHeading,
  getFileDetailsInReverse
} = require("./fileLib.js");

const { validateOptionArgs } = require('./errorLib.js');

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
    let fileContentInOrder = fileContentOrder(fileContent);

    if (numberOfFiles === 1) {
      requiredFileContent = fileContentInOrder;
      return requiredFileContent;
    }
    requiredFileContent = getFileHeading(fileDetail.name);
    requiredFileContent += fileContentInOrder;
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
  selectFileContentOrder
};