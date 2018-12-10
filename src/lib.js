const {
  parseInput
} = require('./headInputLib.js');

const {
  isNumberGreater,
  isValueNumber
} = require('../src/util.js')

const {
  getFileDetails,
  getFileHeading,
  getFileDetailsInReverse
} = require('./fileLib.js');

const runHead = function(fs, inputArgs) {
  let headParameters = parseInput(inputArgs);
  let {
    type,
    count,
    files
  } = headParameters;

  if(type != 'n' && type != 'c') {
    return displayHeadUsage(type);
  }

  if(!isCountAboveZero(count)) {
    return invalidCountMessage(type, count);
  }

  let fileDetails = files.map((file)=> getFileDetails(fs,file));
  return head(fileDetails, headParameters);
}

const runTail = function(fs, inputArgs) {
  let tailParameters = parseInput(inputArgs);
  let {
    type,
    count,
    files
  } = tailParameters;

  if(type != 'n' && type != 'c') {
    return displayTailUsage(type);
  }

  if(!isValueNumber(count)) {
    return invalidCountMessageForTail(count);
  }

  let fileDetails = files.map((file)=> getFileDetailsInReverse(fs,file));
  return tail(fileDetails, tailParameters);
}

const displayHeadUsage = function (type) {
  return "head: illegal option -- " + type + 
    "\nusage: head [-n lines | -c bytes] [file ...]";
}

const displayTailUsage = function (type) {
  return 'tail: illegal option -- ' + type +
    'usage: tail [-F | -f | -r] [-q] [-b # | -c # | -n #] [file ...]'
}

const invalidCountMessage = function(type, count) {
  let typeName = 'line';
  if(type == 'c'){
    typeName = 'byte';
  }
  return 'head: illegal ' + typeName + ' count -- ' + count;
}

const invalidCountMessageForTail = function(count) {
  return "tail: illegal offset -- " + count;
}

const isCountAboveZero = function(count) {
  let isGreaterThanZero = isNumberGreater(0);
  return (isGreaterThanZero(count) && isValueNumber(count));
}

const selectHeadOperation = function(headOption) {
  let options = {
    'n': getFirstNLines,
    'c': getFirstNBytes
  }
  return options[headOption];
}

const head = function(fileDetails, headParameters) {
  let { type, count } = headParameters;
  let headOperation = selectHeadOperation(type);
  let delimiter='';
  return fileDetails.map((fileDetail)=>{
    if(fileDetail.isExists) {
      let currentHeadFile = '';
      if(fileDetails.length > 1) {
        currentHeadFile = delimiter + getFileHeading(fileDetail.name);
        delimiter = '\n';
      }
      currentHeadFile += headOperation(fileDetail.content, count);
      return currentHeadFile;
    }
    return fileDetail.errorMessage;
  }).join('\n');
}

const tail = function(fileDetails, tailParameters) {
  let type = tailParameters.type;
  let count = Math.abs(tailParameters.count);
  let tailOperation = selectHeadOperation(type);
  let delimiter='';
  return fileDetails.map((fileDetail)=>{
    if(fileDetail.isExists) {
      let currentHeadFile = '';
      if(fileDetails.length > 1) {
        currentHeadFile = delimiter + getFileHeading(fileDetail.name);
        delimiter = '\n';
      }
      currentHeadFile += tailOperation(fileDetail.content, count).split('').reverse().join('');
      return currentHeadFile;
    }
    return fileDetail.errorMessage;
  }).join('\n');
}

const getFirstNLines = function(content, count) {
  content = content.split('\n');
  return content.slice(0, count).join('\n');
}

const getFirstNBytes = function(content, count) {
  content = content.split('');
  return content.slice(0, count).join('');
}

module.exports = {
  runHead,
  head,
  getFirstNLines,
  getFirstNBytes,
  isCountAboveZero,
  invalidCountMessage,
  displayHeadUsage,
  selectHeadOperation,
  runTail,
  displayTailUsage
}