const parseInput = function(arguments) {
  return {
    type: 'n',
    count: 10,
    files: arguments
  };
}

const getFirstNLines = function(fileContent, count) {
  fileContent = fileContent.split('\n');
  return fileContent.slice(0, count).join('\n');
}

const readFile = function(fs, file) {
  return fs.readFileSync(file, 'utf-8');
}

module.exports = {
  parseInput,
  getFirstNLines
}
