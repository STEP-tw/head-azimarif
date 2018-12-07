const {
  parseInput
} = require('./headInputLib.js');

const fileNotFound = function(file) {
  return 'head: ' + file + ': No such file or directory';
}

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

const getFileHeading = function(file) {
  return '==> ' + file + ' <==\n';
}

const head = function(fileDetails, headParameters) {
  let {
    type, count, files
  } = headParameters;

  let options = {
    'n': getFirstNLines,
    'c': getFirstNBytes
  }
  
  let headOption = options[type];
  let headOfFile=[];
  let delimiter='';
  fileDetails.forEach(( fileDetail)=>{
    headOfFile.push(fileDetail.errorMessage);
    if(fileDetail.isExists) {
      headOfFile.pop();
      let currentHeadFile = delimiter + getFileHeading(fileDetail.name);
      delimiter = '\n';
      if(fileDetails.length < 2) {
        currentHeadFile = '';
      }
      currentHeadFile += headOption(fileDetail.content, count) ;
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

const getFileDetails = function(fs, file){
  let fileDetail = {
    content : readFile(fs, file),
    name : file, 
    isExists : true,
    errorMessage : ''
  };
  if(!isFileExists(fs, file)) {
      fileDetail.isExists = false;
      fileDetail.errorMessage = fileNotFound(file);
  }
  return fileDetail;
}

const readFile = function(fs, file) {
  if(isFileExists(fs, file)) {
    return fs.readFileSync(file, 'utf-8');
  }
}

const isFileExists = function(fs, file) {
  return fs.existsSync(file);
}

module.exports = {
  runHead,
  head,
  getFirstNLines,
  getFirstNBytes,
  getFileHeading,
  isCountAboveZero,
  invalidCountMessage,
  displayHeadUsage,
  fileNotFound
}
