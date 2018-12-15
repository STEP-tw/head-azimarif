const {
  getFileHeading,
  displayFileNotFoundError,
  getFileDetails,
  getFileDetailsInReverse
} = require('../src/fileLib.js');

const assert = require("assert");

describe('getFileHeading', () => {
  it('should return the fileName with heading', () => {
    let file = 'myFile.txt'
    assert.deepEqual(getFileHeading(file), '==> '+ file +' <==\n');
  });
});

describe('displayFileNotFoundError', () => {
  it('should return file not found message with file name', () => {
    assert.deepEqual(displayFileNotFoundError('myFile.txt', 'head'), 'head: myFile.txt: No such file or directory');
    assert.deepEqual(displayFileNotFoundError('123.txt', 'head'), 'head: 123.txt: No such file or directory');
  });

  it('should return file not found message with file name', () => {
    assert.deepEqual(displayFileNotFoundError('myFile.txt', 'tail'), 'tail: myFile.txt: No such file or directory');
    assert.deepEqual(displayFileNotFoundError('123.txt', 'tail'), 'tail: 123.txt: No such file or directory');
  });
});

const files = {
  'file1': 'This is the content of file 1\nLine 2',
  'file2': 'This is the content of file 2'
}

const fs = { 
  existsSync : (file)=>{
    return files.hasOwnProperty(file);
  },
  readFileSync : (file)=> {
    return files[file];
  }
}

describe('getFileDetails', () => {
  it('should return the content of the file when file exists ', () => {
    assert.deepEqual(getFileDetails(fs, "file1"), {
      content: 'This is the content of file 1\nLine 2',
      name: 'file1',
      isExists: true,
      errorMessage: ''
    });
  });
  it('should return the error message if the file does not exist ', () => {
    assert.deepEqual(getFileDetails(fs, "file9"), {
      content: undefined,
      name: 'file9',
      isExists: false,
      errorMessage: 'head: file9: No such file or directory'
    });
  });
});

describe('getFileDetailsInReverse', () => {
  it('should return the content of the file when file exists ', () => {
    assert.deepEqual(getFileDetailsInReverse(fs, "file1"), {
      content: '2 eniL\n1 elif fo tnetnoc eht si sihT',
      name: 'file1',
      isExists: true,
      errorMessage: ''
    });
  });
  it('should return the error message if the file does not exist ', () => {
    assert.deepEqual(getFileDetailsInReverse(fs, "file9"), {
      content: undefined,
      name: 'file9',
      isExists: false,
      errorMessage: 'tail: file9: No such file or directory'
    });
  });
});