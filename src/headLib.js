const parseInput = function(arguments) {
  if(arguments[0][0] == '-') {
    return getHeadParameters(arguments);
  }
  return { 
    type : 'n', 
    count : 10, 
    files : arguments 
  };
}

const fileNotFound = function(file) {
  return 'head: ' + file + ': No such file or directory';
}

const getHeadParameters = function(headParameters){
  if(headParameters[0] == '-n' || headParameters[0] == '-c'){
    return {
      type : headParameters[0][1],
      count : headParameters[1],
      files : headParameters.slice(2)
    };
  }

  if(!isNaN(Math.abs(headParameters[0]))){
    return {
      type : 'n',
      count : Math.abs(headParameters[0]),
      files : headParameters.slice(1)
    };
  }

  return {
    type : headParameters[0][1],
    count : headParameters[0].slice(2),
    files : headParameters.slice(1)
  };
}

const head = function(fs, inputArgs) {
  let headParameters = parseInput(inputArgs);
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

  let fileDetails = files.map((file)=> getFileDetails(fs,file));
  return selectFileContent(fileDetails, headParameters, options[type]);
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

const selectFileContent = function(fileDetails, headParameters, headOption) {
  let {
    type, count, files
  } = headParameters;

  let headOfFile=[];
  let delimiter='';
  fileDetails.forEach(( fileDetail)=>{
    headOfFile.push(fileDetail.content);
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
    isExists : true
  };
  if(!isFileExists(fs, file)) {
      fileDetail.isExists = false;
  }
  return fileDetail;
}

const readFile = function(fs, file) {
  if(isFileExists(fs, file)) {
    return fs.readFileSync(file, 'utf-8');
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
  getHeadParameters,
  fileNotFound
}
