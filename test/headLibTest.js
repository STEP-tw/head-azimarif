const {
  parseInput,
  getHeadParameters,
  getFirstNLines,
  getFirstNBytes,
  getFileHeading,
  isCountAboveZero,
  invalidCountMessage,
  displayHeadUsage,
  fileNotFound,
  head
} = require('../src/headLib.js');
const {
  deepEqual
} = require('assert');

describe('parseInput', () => {
  it('should return an object with type n, count 10 and fileName in files array while passing the fileName as input', () => {
    deepEqual(parseInput(['file1.txt']), { type: 'n', count: 10, files: ['file1.txt'] });
  });

  it('should return an object with type n, count 10 and fileNames in files array while passing multiple fileName as input', () => {
    deepEqual(parseInput(['file1.txt', 'file2.txt', 'file3.txt']), { type: 'n', count: 10, files: ['file1.txt', 'file2.txt', 'file3.txt'] });
  });

  it('should return an object with type n and count, fileName in files array while passing the count & fileName as input', () => {
    deepEqual(parseInput(['-0', 'file1.txt']), { type: 'n', count: 0, files: ['file1.txt'] });
    deepEqual(parseInput(['-1', 'file1.txt', 'file2.txt', 'file3.txt']), { type: 'n', count: 1, files: ['file1.txt', 'file2.txt', 'file3.txt'] });
    deepEqual(parseInput(['-100', 'file1.txt', 'file2.txt', 'file3.txt']), { type: 'n', count: 100, files: ['file1.txt', 'file2.txt', 'file3.txt'] });
  });

  it('should return an object of type, count and fileNames when all three arguments are passed', () => {
    deepEqual(parseInput(['-n1', 'file1.txt']), { type: 'n', count: 1, files: ['file1.txt'] });
    deepEqual(parseInput(['-n1', 'file1.txt', 'file2.txt']), { type: 'n', count: 1, files: ['file1.txt', 'file2.txt'] });
    deepEqual(parseInput(['-n', '1', 'file1.txt']), { type: 'n', count: 1, files: ['file1.txt'] });
    deepEqual(parseInput(['-n', '1', 'file1.txt', 'file2.txt']), { type: 'n', count: 1, files: ['file1.txt', 'file2.txt'] });
    deepEqual(parseInput(['-c1', 'file1.txt']), { type: 'c', count: 1, files: ['file1.txt'] });
    deepEqual(parseInput(['-c1', 'file1.txt', 'file2.txt']), { type: 'c', count: 1, files: ['file1.txt', 'file2.txt'] });
    deepEqual(parseInput(['-c', '1', 'file1.txt']), { type: 'c', count: 1, files: ['file1.txt'] });
    deepEqual(parseInput(['-c', '1', 'file1.txt', 'file2.txt']), { type: 'c', count: 1, files: ['file1.txt', 'file2.txt'] });
  });
});

describe('getHeadParameters', () => {
  it('should return an object of type, count and fileNames when all three arguments are passed', () => {
    deepEqual(getHeadParameters(['-n1', 'file1.txt']), { type: 'n', count: 1, files: ['file1.txt'] });
    deepEqual(getHeadParameters(['-n1', 'file1.txt', 'file2.txt']), { type: 'n', count: 1, files: ['file1.txt', 'file2.txt'] });
    deepEqual(getHeadParameters(['-n', '1', 'file1.txt']), { type: 'n', count: 1, files: ['file1.txt'] });
    deepEqual(getHeadParameters(['-n', '1', 'file1.txt', 'file2.txt']), { type: 'n', count: 1, files: ['file1.txt', 'file2.txt'] });
    deepEqual(getHeadParameters(['-c1', 'file1.txt']), { type: 'c', count: 1, files: ['file1.txt'] });
    deepEqual(getHeadParameters(['-c1', 'file1.txt', 'file2.txt']), { type: 'c', count: 1, files: ['file1.txt', 'file2.txt'] });
    deepEqual(getHeadParameters(['-c', '1', 'file1.txt']), { type: 'c', count: 1, files: ['file1.txt'] });
    deepEqual(getHeadParameters(['-c', '1', 'file1.txt', 'file2.txt']), { type: 'c', count: 1, files: ['file1.txt', 'file2.txt'] });
  });
});

describe('getFirstNLines', () => {
  const fileContent = 'One\nTwo\nThree\nFour\nFive\nSix\nSeven\nEight\nNine\nTen';
  it('should return 0 line (empty string) when count is 0', () => {
    deepEqual(getFirstNLines(fileContent, 0), '');
  });

  it('should return 1 line when count is 1', () => {
    deepEqual(getFirstNLines(fileContent, 1), 'One');
  });

  it('should return 5 lines  when count is 5', () => {
    deepEqual(getFirstNLines(fileContent, 5), 'One\nTwo\nThree\nFour\nFive');
  });
});

describe('getFirstNBytes', () => {
  const fileContent = 'One\nTwo\nThree\nFour\nFive\nSix\nSeven\nEight\nNine\nTen';
  it('should return 0 byte (empty string) when count is 0', () => {
    deepEqual(getFirstNBytes(fileContent, 0), '');
  });

  it('should return 1 byte when count is 1', () => {
    deepEqual(getFirstNBytes(fileContent, 1), 'O');
  });

  it('should return 5 bytes  when count is 5', () => {
    deepEqual(getFirstNBytes(fileContent, 5), 'One\nT');
  });
});

describe('getFileHeading', () => {
  it('should return the fileName with heading', () => {
    let file = 'myFile.txt'
    deepEqual(getFileHeading(file), '==> '+ file +' <==\n');
  });
});

describe('isCountAboveZero', () => {
  it('should return false if count is 0', () => {
    deepEqual(isCountAboveZero(0), false);
  });
  it('should return false if count is less than 0', () => {
    deepEqual(isCountAboveZero(-1), false);
  });
  it('should return false if count is non integer value', () => {
    deepEqual(isCountAboveZero('a'), false);
  });
  it('should return true if count is greater than 0', () => {
    deepEqual(isCountAboveZero(1), true);
  });
  it('should return true if count is greater than 0', () => {
    deepEqual(isCountAboveZero(10), true);
  });
});

describe('invalidCountMessage', () => {
  it('should return message with line and count', () => {
    deepEqual(invalidCountMessage('n',-1), 'head: illegal line count -- -1');
  });
  it('should return message with line and count', () => {
    deepEqual(invalidCountMessage('c',-1), 'head: illegal byte count -- -1');
  });
});

describe('displayHeadUsage', () => {
  it('should return usage message with type', () => {
    deepEqual(displayHeadUsage('p'), 'head: illegal option -- p\nusage: head [-n lines | -c bytes] [file ...]');
  });
  it('should return usage message with type', () => {
    deepEqual(displayHeadUsage('-'), 'head: illegal option -- -\nusage: head [-n lines | -c bytes] [file ...]');
  });
});

describe('fileNotFound', () => {
  it('should return file not found message with file name', () => {
    deepEqual(fileNotFound('myFile.txt'), 'head: myFile.txt: No such file or directory');
    deepEqual(fileNotFound('123.txt'), 'head: 123.txt: No such file or directory');
  });
});

describe('head', () => {
  describe('head with one file', ()=> {
    let fileDetails = [
      { 
        content : 'This is the first Line.\nSecond Line\n1234\nEND',
        file : 'testFile',
        isExists : true 
      }
    ];

    it('should return empty string when input line is 0 and only file passed', () => {
      deepEqual(head(fileDetails, { type : 'n', count : 0, files : ['testFile'] }), '');
    });

    it('should return one line when input line is 1 and only file passed', () => {
      deepEqual(head(fileDetails, { type : 'n', count : 1, files : ['testFile'] }), 'This is the first Line.');
    });

    it('should return all content of file when input line is greater than total file line length and only file passed', () => {
      deepEqual(head(fileDetails, { type : 'n', count : 10, files : ['testFile'] }), 'This is the first Line.\nSecond Line\n1234\nEND');
    });

    it('should return empty string when input character count is 0 and only file passed', () => {
      deepEqual(head(fileDetails, { type : 'c', count : 0, files : ['testFile'] }), '');
    });

    it('should return one character when input character count is 1 and only file passed', () => {
      deepEqual(head(fileDetails, { type : 'c', count : 1, files : ['testFile'] }), 'T');
    });

    it('should return all content of file when input character count is greater than total file characters length and only file passed', () => {
      deepEqual(head(fileDetails, { type : 'c', count : 100, files : ['testFile'] }), 'This is the first Line.\nSecond Line\n1234\nEND');
    });
  });

  describe('head with more than one file', ()=> {
    let fileDetails1 = [
      { 
        content : 'This is the first Line.\nSecond Line\n1234\nEND',
        name : 'testFile1',
        isExists : true 
      },
      { 
        content : 'One\nTwo\nThree\n',
        name : 'testFile2',
        isExists : true 
      }
    ];
    it('should return one line from two files with their name as heading when input line is 1 and files are 2', () => {
      deepEqual(head(fileDetails1, { type : 'n', count : 1 }), '==> testFile1 <==\nThis is the first Line.\n\n==> testFile2 <==\nOne');
    });

    it('should return all lines from two files with their name as heading when input line is greater than line count of files and files are 2', () => {
      deepEqual(head(fileDetails1, { type : 'n', count : 10 }), '==> testFile1 <==\nThis is the first Line.\nSecond Line\n1234\nEND\n\n==> testFile2 <==\nOne\nTwo\nThree\n');
    });

    it('should return one character from two files with their name as heading when input character count is 1 and files are 2', () => {
      deepEqual(head(fileDetails1, { type : 'c', count : 1 }), '==> testFile1 <==\nT\n==> testFile2 <==\nO');
    });

    it('should return all characters from two files with their name as heading when input character count is greater than total character length of files and files are 2', () => {
      deepEqual(head(fileDetails1, { type : 'c', count : 10 }), '==> testFile1 <==\nThis is th\n==> testFile2 <==\nOne\nTwo\nTh');
    });
  });
});
