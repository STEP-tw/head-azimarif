const {
  reverseText
} = require('../src/util.js');

const displayFileNotFoundError = function(file, option) {
  return option + ": " + file + ": No such file or directory"; 
};

const getFileHeading = function(file) {
  return "==> " + file + " <==\n";
};

const getFileDetails = function(fs, file) {
  let fileDetail = {
    content: readFile(fs, file),
    name: file,
    isExists: true,
    errorMessage: ""
  };
  if (!isFileExists(fs, file)) {
    fileDetail.isExists = false;
    fileDetail.errorMessage = displayFileNotFoundError(file, 'head');
  }
  return fileDetail;
};

const getFileDetailsInReverse = function(fs, file) {
  let fileDetail = getFileDetails(fs, file);
  if (fileDetail.content != undefined) {
    fileDetail.content = reverseText(fileDetail.content);
    return fileDetail;
  }
  fileDetail.errorMessage = displayFileNotFoundError(file, 'tail');
  return fileDetail;
};

const readFile = function(fs, file) {
  if (isFileExists(fs, file)) {
    return fs.readFileSync(file, "utf-8");
  }
};

const isFileExists = function(fs, file) {
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
