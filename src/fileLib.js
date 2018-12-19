const { reverseText } = require("../src/util.js");

const displayFileNotFoundError = function(fileName, command) {
  return command + ": " + fileName + ": No such file or directory"; 
};

const getFileHeading = function(fileName) {
  return "==> " + fileName + " <==\n";
};

const getFileDetails = function(file, fs) {
  let fileDetail = {
    content: readFile(file, fs),
    name: file,
    isExists: true,
    errorMessage: ""
  };
  if (!isFileExists(file, fs)) {
    fileDetail.isExists = false;
    fileDetail.errorMessage = displayFileNotFoundError(file, 'head');
  }
  return fileDetail;
};

const getFileDetailsInReverse = function(file, fs) {
  let fileDetail = getFileDetails(file, fs);
  if (fileDetail.content != undefined) {
    fileDetail.content = reverseText(fileDetail.content);
    return fileDetail;
  }
  fileDetail.errorMessage = displayFileNotFoundError(file, 'tail');
  return fileDetail;
};

const readFile = function(file, fs) {
  if (isFileExists(file, fs)) {
    return fs.readFileSync(file, "utf-8");
  }
};

const isFileExists = function(file, fs) {
  return fs.existsSync(file);
};

module.exports = {
  getFileHeading,
  displayFileNotFoundError,
  getFileDetails,
  readFile,
  isFileExists,
  getFileDetailsInReverse
};