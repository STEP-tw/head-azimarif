const {
  parseInput,
  getFirstNLines
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

