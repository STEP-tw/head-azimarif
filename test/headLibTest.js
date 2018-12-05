const {
  parseInput,
  getHeadParameters,
  getFirstNLines,
  getFirstNBytes,
  getFileHeading,
  isCountAboveZero,
  invalidCountMessage
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

