const fileNotFound = function(file) {
  return "head: " + file + ": No such file or directory";
};

const fileNotFoundMessageForTail = function(file) {
  return "tail: " + file + ": No such file or directory";
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
    fileDetail.errorMessage = fileNotFound(file);
  }
  return fileDetail;
};

const getFileDetailsInReverse = function(fs, file) {
  let fileDetail = getFileDetails(fs, file);
  if (fileDetail.content != undefined) {
    fileDetail.content = fileDetail.content.split('').reverse().join('');
    return fileDetail;
  }
  fileDetail.errorMessage = fileNotFoundMessageForTail(file);
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
  fileNotFound,
  getFileDetails,
  readFile,
  isFileExists,
  getFileDetailsInReverse,
  fileNotFoundMessageForTail
};
