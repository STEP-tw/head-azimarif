const {
  parseInput,
  getHeadParameters
} = require('../src/inputLib.js');
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