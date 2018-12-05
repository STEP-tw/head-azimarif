const parseInput = function(arguments) {
  if(arguments[0].match(/[-][a-zA-Z]|![0-9]|[-][-]/)){
    return getHeadParameters(arguments);
  }
  if(isNaN(Math.abs(arguments[0]))){
    return {
      type : 'n',
      count : 10, 
      files : arguments
    };
  }
  return {
    type: 'n',
    count: Math.abs(arguments[0]),
    files: arguments.splice(1)
  };
}

const fileNotFound = function(file) {
  return 'head: ' + file + ': No such file or directory';
}

const getHeadParameters = function(headParameters){
  let type = headParameters[0].split('')[1];
  let count = headParameters[0].split('').splice(2).join('');
  headParameters = headParameters.splice(1);
  let files = headParameters;
  if(count==''){
    count = headParameters[0];
    files = headParameters.splice(1);
  }
  return {
    type,
    count,
    files
  };
}

const head = function(fs, headParameters) {
  let {
    type,
    count,
    files
  } = headParameters;
  let options = {
    'n': getFirstNLines,
    'c': getFirstNBytes
  }

  if(type != 'n' && type != 'c') {
    return displayHeadUsage(type);
  }

  if(!isCountAboveZero(count)) {
    return invalidCountMessage(type, count);
  }
  return selectFileContent(fs, headParameters, options[type]);
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

const selectFileContent = function(fs, headParameters, headOption) {
  let {
    type, count, files
  } = headParameters;

  let headOfFile=[];
  let delimiter='';
  files.forEach((file)=>{
    let fileContent = readFile(fs, file);
    headOfFile.push(fileContent);
    if(isFileExists(fs,file)){
      headOfFile.pop();
      let currentHeadFile = delimiter + getFileHeading(file);
      delimiter = '\n';
      if (files.length < 2 ) {
        currentHeadFile = '';
      }
      currentHeadFile += headOption(fileContent, count) ;
      headOfFile.push(currentHeadFile);
    }
  });
  return headOfFile.join('\n');
}

const getFirstNLines = function(fileContent, count) {
  fileContent = fileContent.split('\n');
  return fileContent.slice(0, count).join('\n');
}

const getFirstNBytes = function(fileContent, count) {
  fileContent = fileContent.split('');
  return fileContent.slice(0, count).join('');
}

const readFile = function(fs, file) {
  if(isFileExists(fs, file)) {
    let fileContent = fs.readFileSync(file, 'utf-8').split('\n');
    let numberOfLines = fileContent.length - 1;
    fileContent.splice(numberOfLines);
    return fileContent.join('\n');
  }
  return fileNotFound(file);
}

const isFileExists = function(fs, file) {
  return fs.existsSync(file);
}

module.exports = {
  parseInput,
  head,
  getFirstNLines,
  getFirstNBytes,
  getFileHeading,
  isCountAboveZero,
  invalidCountMessage,
  displayHeadUsage,
  getHeadParameters
}
