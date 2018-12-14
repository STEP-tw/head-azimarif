const {
  getFirstNLines,
  getFirstNBytes,
  isCountAboveZero,
  invalidCountMessage,
  displayUsage,
  head,
  selectOperation,
  tail,
  runHead,
  runTail
} = require('../src/lib.js');

const { deepEqual } = require("assert");

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
    deepEqual(invalidCountMessage({ option: 'head', type: 'n', count: -1 }), 'head: illegal line count -- -1');
  });

  it('should return message with line and count', () => {
    deepEqual(invalidCountMessage({ option: 'head', type: 'c', count: -1 }), 'head: illegal byte count -- -1');
  });

  it('should return message with line and count', () => {
    deepEqual(invalidCountMessage({ option: 'tail', type: 'n', count: -1 }), 'tail: illegal offset -- -1');
  });

  it('should return message with line and count', () => {
    deepEqual(invalidCountMessage({ option: 'tail', type: 'c', count: -1 }), 'tail: illegal offset -- -1');
  });
});

describe('displayUsage', () => {
  it('should return head usage message with type', () => {
    deepEqual(displayUsage({ option: 'head', type: 'p'}), 'head: illegal option -- p\nusage: head [-n lines | -c bytes] [file ...]');
  });
  it('should return tail usage message with type', () => {
    deepEqual(displayUsage({ option: 'tail', type: '-'}), 'tail: illegal option -- -\nusage: tail [-F | -f | -r] [-q] [-b # | -c # | -n #] [file ...]');
  });
});