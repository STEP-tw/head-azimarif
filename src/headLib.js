const {
  parseInput
} = require('./headInputLib.js');

const {
  getFileDetails,
  getFileHeading
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

const displayHeadUsage = function (type) {
  return "head: illegal option -- " + type + 
    "\nusage: head [-n lines | -c bytes] [file ...]";
}

const invalidCountMessage = function(type, count) {
  let typeName = 'line';
  if(type == 'c'){
    typeName = 'byte';
  }
  return 'head: illegal ' + typeName + ' count -- ' + count;
}

const isCountAboveZero = function(count) {
  return !(count < 1 || isNaN(count));
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
  let headOfFile=[];
  let delimiter='';
  fileDetails.forEach((fileDetail)=>{
    headOfFile.push(fileDetail.errorMessage);
    if(fileDetail.isExists) {
      //To remove the error message pushed only if file exists
      headOfFile.pop(); 
      let currentHeadFile = delimiter + getFileHeading(fileDetail.name);
      delimiter = '\n';
      if(fileDetails.length < 2) {
        currentHeadFile = '';
      }
      currentHeadFile += headOperation(fileDetail.content, count) ;
      headOfFile.push(currentHeadFile);
    }
  });
  if(type == 'c'){
    return headOfFile.join('');
  }
  return headOfFile.join('\n');
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
  selectHeadOperation
}
