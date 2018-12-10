const {
  getFirstNLines,
  getFirstNBytes,
  isCountAboveZero,
  invalidCountMessage,
  displayHeadUsage,
  head,
  selectHeadOperation,
  isTailCountInvalid
} = require('../src/lib.js');
const {
  deepEqual
} = require('assert');

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
      deepEqual(head(fileDetails1, { type : 'c', count : 1 }), '==> testFile1 <==\nT\n\n==> testFile2 <==\nO');
    });

    it('should return all characters from two files with their name as heading when input character count is greater than total character length of files and files are 2', () => {
      deepEqual(head(fileDetails1, { type : 'c', count : 10 }), '==> testFile1 <==\nThis is th\n\n==> testFile2 <==\nOne\nTwo\nTh');
    });
  });
});

describe('selectHeadOperation', () => {
  it('should return getFirstNLines function when option is n', () => {
    deepEqual(selectHeadOperation('n'), getFirstNLines);
  });

  it('should return getFirstNBytes function when option is c', () => {
    deepEqual(selectHeadOperation('c'), getFirstNBytes);
  });
 
  it('should return undefined when option is other than n or c', () => {
    deepEqual(selectHeadOperation('o'), undefined);
  });
});

describe('isTailCountInvalid', () => {
  it('should return getFirstNBytes function when option is c', () => {
    deepEqual(isTailCountInvalid(0), true);
  });

  it('should return getFirstNBytes function when option is c', () => {
    deepEqual(isTailCountInvalid(1), true);
  });
  
  it('should return getFirstNLines function when option is n', () => {
    deepEqual(isTailCountInvalid('a'), false);
  });

  it('should return getFirstNBytes function when option is c', () => {
    deepEqual(isTailCountInvalid('-c'), false);
  });
});