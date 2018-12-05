const parseInput = function(arguments) {
  return {
    type: 'n',
    count: 10,
    files: arguments
  };
}

const readFile = function(fs, file) {
  return fs.readFileSync(file, 'utf-8');
}

module.exports = {
  parseInput,
}
