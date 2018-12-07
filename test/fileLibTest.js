const {
  getFileHeading,
  fileNotFound,
  getFileDetails,
  readFile,
  isFileExists
} = require('../src/fileLib.js');
const {
  deepEqual
} = require('assert');

describe('getFileHeading', () => {
  it('should return the fileName with heading', () => {
    let file = 'myFile.txt'
    deepEqual(getFileHeading(file), '==> '+ file +' <==\n');
  });
});

describe('fileNotFound', () => {
  it('should return file not found message with file name', () => {
    deepEqual(fileNotFound('myFile.txt'), 'head: myFile.txt: No such file or directory');
    deepEqual(fileNotFound('123.txt'), 'head: 123.txt: No such file or directory');
  });
});