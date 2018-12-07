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

const files = {
  'file1': 'This is the content of file 1',
  'file2': 'This is the content of file 2'
}

const fs = { 
  existsSync : (file)=>{
    if(files.hasOwnProperty(file)){
      return true;
    }
    return false;
  },
  readFileSync : (file)=> {
    return files[file];
  }
}

describe('getFileDetails', () => {
  it('should return the content of the file when file exists ', () => {
    deepEqual(getFileDetails(fs, "file1"), {
      content: 'This is the content of file 1',
      name: 'file1',
      isExists: true,
      errorMessage: ''
    });
  });
  it('should return the content of the file when file exists ', () => {
    deepEqual(getFileDetails(fs, "file9"), {
      content: undefined,
      name: 'file9',
      isExists: false,
      errorMessage: 'head: file9: No such file or directory'
    });
  });
});
