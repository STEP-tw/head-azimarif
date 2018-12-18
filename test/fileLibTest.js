const {
  getFileHeading,
  displayFileNotFoundError,
  getFileDetails,
  getFileDetailsInReverse
} = require('../src/fileLib.js');

const assert = require("assert");

describe('getFileHeading', () => {
  it('should return the fileName with heading', () => {
    let file = 'myFile.txt';
    let expectedOutput = '==> ' + file + ' <==\n';
    assert.equal(getFileHeading(file), expectedOutput);
  });

  it('should return the heading when file name is not given', () => {
    let expectedOutput = '==>  <==\n';
    assert.equal(getFileHeading(''), expectedOutput);
  });
});

describe('displayFileNotFoundError', () => {
  it('should return file not found message with file name', () => {
    let expectedOutput = 'head: myFile.txt: No such file or directory';
    assert.equal(displayFileNotFoundError('myFile.txt', 'head'), expectedOutput);

    expectedOutput = 'head: 123.txt: No such file or directory';
    assert.equal(displayFileNotFoundError('123.txt', 'head'), expectedOutput);
  });

  it('should return file not found message with file name', () => {
    let expectedOutput = 'tail: myFile.txt: No such file or directory';
    assert.equal(displayFileNotFoundError('myFile.txt', 'tail'), expectedOutput);

    expectedOutput = 'tail: 123.txt: No such file or directory';
    assert.equal(displayFileNotFoundError('123.txt', 'tail'), expectedOutput);
  });
});

const files = {
  file1: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].join('\n'),
  file2: 'This is the content of file 2'
}

const fs = {
  existsSync: (file) => {
    return files.hasOwnProperty(file);
  },
  readFileSync: (file) => {
    return files[file];
  }
}

describe('getFileDetails', () => {
  it('should return the content of the file when file exists ', () => {
    let expectedOutput = {
      content: '1\n2\n3\n4\n5\n6\n7\n8\n9\n10',
      name: 'file1',
      isExists: true,
      errorMessage: ''
    };
    assert.deepEqual(getFileDetails("file1", fs), expectedOutput);
  });

  it('should return the error message if the file does not exist ', () => {
    let expectedOutput = {
      content: undefined,
      name: 'file9',
      isExists: false,
      errorMessage: 'head: file9: No such file or directory'
    };
    assert.deepEqual(getFileDetails("file9", fs), expectedOutput);
  });
});

describe('getFileDetailsInReverse', () => {
  it('should return the content of the file when file exists ', () => {
    let expectedOutput = {
      content: '01\n9\n8\n7\n6\n5\n4\n3\n2\n1',
      name: 'file1',
      isExists: true,
      errorMessage: ''
    };
    assert.deepEqual(getFileDetailsInReverse("file1", fs), expectedOutput);
  });

  it('should return the error message if the file does not exist ', () => {
    let expectedOutput = {
      content: undefined,
      name: 'file9',
      isExists: false,
      errorMessage: 'tail: file9: No such file or directory'
    };
    assert.deepEqual(getFileDetailsInReverse("file9", fs), expectedOutput);
  });
});