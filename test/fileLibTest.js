const {
  getFileHeading,
  fileNotFound,
  getFileDetails,
  getFileDetailsInReverse
} = require('../src/fileLib.js');
const {
  runHead,
  runTail
} = require('../src/lib.js');
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
    deepEqual(fileNotFound('myFile.txt', true), 'head: myFile.txt: No such file or directory');
    deepEqual(fileNotFound('123.txt', true), 'head: 123.txt: No such file or directory');
  });

  it('should return file not found message with file name', () => {
    deepEqual(fileNotFound('myFile.txt', false), 'tail: myFile.txt: No such file or directory');
    deepEqual(fileNotFound('123.txt', false), 'tail: 123.txt: No such file or directory');
  });
});

const files = {
  'file1': 'This is the content of file 1\nLine 2',
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
      content: 'This is the content of file 1\nLine 2',
      name: 'file1',
      isExists: true,
      errorMessage: ''
    });
  });
  it('should return the error message if the file does not exist ', () => {
    deepEqual(getFileDetails(fs, "file9"), {
      content: undefined,
      name: 'file9',
      isExists: false,
      errorMessage: 'head: file9: No such file or directory'
    });
  });
});

describe('getFileDetailsInReverse', () => {
  it('should return the content of the file when file exists ', () => {
    deepEqual(getFileDetailsInReverse(fs, "file1"), {
      content: '2 eniL\n1 elif fo tnetnoc eht si sihT',
      name: 'file1',
      isExists: true,
      errorMessage: ''
    });
  });
  it('should return the error message if the file does not exist ', () => {
    deepEqual(getFileDetailsInReverse(fs, "file9"), {
      content: undefined,
      name: 'file9',
      isExists: false,
      errorMessage: 'tail: file9: No such file or directory'
    });
  });
});

describe('runHead', () => {
  describe('with one file only', () => {
    it('should return all lines from file when option & count is not given', () => {
      deepEqual(runHead(fs, ['file1']), 'This is the content of file 1\nLine 2');
    });
    it('should return 1 line from file when option is n & line count is 1', () => {
      deepEqual(runHead(fs, ['-n', '1', 'file1']), 'This is the content of file 1');
    });
    it('should return 1 byte from file when option is c & byte count is 1', () => {
      deepEqual(runHead(fs, ['-c', '1', 'file1']), 'T');
    });
    it('should return error message if file not found', () => {
      deepEqual(runHead(fs, ['-c', '1', 'myFile']), 'head: myFile: No such file or directory');
    });

  });

  describe('with more than one file', () => {
    it('should return all lines from file when option & count is not given', () => {
      deepEqual(runHead(fs, ['file1', 'file2']), '==> file1 <==\nThis is the content of file 1\nLine 2\n\n==> file2 <==\nThis is the content of file 2');
    });
    it('should return 1 line from file when option is n & line count is 1', () => {
      deepEqual(runHead(fs, ['-n', '1', 'file1', 'file2']), '==> file1 <==\nThis is the content of file 1\n\n==> file2 <==\nThis is the content of file 2');
    });
    it('should return 1 byte from file when option is c & byte count is 1', () => {
      deepEqual(runHead(fs, ['-c', '1', 'file1', 'file2']), '==> file1 <==\nT\n\n==> file2 <==\nT');
    });
    it('should return error message if file not found', () => {
      deepEqual(runHead(fs, ['-c', '1', 'myFile', 'myFile2']), 'head: myFile: No such file or directory\nhead: myFile2: No such file or directory');
    });
  });

  describe('error message and usage', () => {
    it('should return error message when count is less than 1 or not a number', () => {
      deepEqual(runHead(fs, ['-n', '0', 'file1']), 'head: illegal line count -- 0');
    });
    it('should return usage message when option other than n or c is given', () => {
      deepEqual(runHead(fs, ['-p', '0', 'file1']), 'head: illegal option -- p\nusage: head [-n lines | -c bytes] [file ...]');
    });
  });
});


describe('runTail', () => {
  describe('with one file only', () => {
    it('should return all lines from file when option & count is not given', () => {
      deepEqual(runTail(fs, ['file1']), 'This is the content of file 1\nLine 2');
    });
    it('should return 1 line from file when option is n & line count is 1', () => {
      deepEqual(runTail(fs, ['-n', '1', 'file1']), 'Line 2');
    });
    it('should return 1 byte from file when option is c & byte count is 1', () => {
      deepEqual(runTail(fs, ['-c', '1', 'file1']), '2');
    });
    it('should return error message if file not found', () => {
      deepEqual(runTail(fs, ['-c', '1', 'myFile']), 'tail: myFile: No such file or directory');
    });

  });

  describe('with more than one file', () => {
    it('should return all lines from file when option & count is not given', () => {
      deepEqual(runTail(fs, ['file1', 'file2']), '==> file1 <==\nThis is the content of file 1\nLine 2\n\n==> file2 <==\nThis is the content of file 2');
    });
    it('should return 1 line from file when option is n & line count is 1', () => {
      deepEqual(runTail(fs, ['-n', '1', 'file1', 'file2']), '==> file1 <==\nLine 2\n\n==> file2 <==\nThis is the content of file 2');
    });
    it('should return 1 byte from file when option is c & byte count is 1', () => {
      deepEqual(runTail(fs, ['-c', '1', 'file1', 'file2']), '==> file1 <==\n2\n\n==> file2 <==\n2');
    });
    it('should return error message if file not found', () => {
      deepEqual(runTail(fs, ['-c', '1', 'myFile', 'myFile2']), 'tail: myFile: No such file or directory\ntail: myFile2: No such file or directory');
    });
  });

  describe('error message and usage', () => {
    it('should return error message when count is less than 1 or not a number', () => {
      deepEqual(runTail(fs, ['-n', '0', 'file1']), '');
    });
    it('should return usage message when option other than n or c is given', () => {
      deepEqual(runTail(fs, ['-p', '0', 'file1']), 'tail: illegal option -- p\nusage: tail [-F | -f | -r] [-q] [-b # | -c # | -n #] [file ...]');
    });
    it("should return error message when count is less than 1 or not a number", () => {
      deepEqual(runTail(fs, ["-n", "p", "file1"]), 'tail: illegal offset -- p');
    });
  });
});