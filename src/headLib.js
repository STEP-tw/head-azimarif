const parseInput = function(arguments) {
  if(arguments[0].includes('-n') || arguments[0].includes('-c')){
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
  let options = {
    'n': getFirstNLines,
  }
  return selectFileContent(fs, headParameters, options[headParameters.type]);
}

const selectFileContent = function(fs, headParameters, headOption) {
  let {
    type, count, files
  } = headParameters;

  let headOfFile=[];
  files.forEach((file)=>{
    let currentHeadFile = '==> ' + file + ' <==\n';
    if (files.length < 2) {
      currentHeadFile = '';
    }
    let fileContent = readFile(fs, file);
    currentHeadFile += headOption(fileContent, count);
    headOfFile.push(currentHeadFile);
  });
  return headOfFile.join('\n\n');
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
  let fileContent = fs.readFileSync(file, 'utf-8').split('\n');
  let numberOfLines = fileContent.length - 1;
  fileContent.splice(numberOfLines);
  return fileContent.join('\n');
}

module.exports = {
  parseInput,
  head,
  getFirstNLines,
  getFirstNBytes
}
