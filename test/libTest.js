const {
  getFirstNLines,
  getFirstNBytes,
  isCountAboveZero,
  invalidCountMessage,
  displayUsage,
  runCommand,
  selectOperation,
  head,
  tail,
  selectFileContentOrder,
  isInvalidOption
} = require('../src/lib.js');

const { identity, reverseText } = require('../src/util.js');

const assert = require("assert");

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

describe('getFirstNLines', () => {
  const fileContent = [1,2,3,4,5,6,7,8,9,10].join('\n');
  it('should return 0 line (empty string) when count is 0', () => {
    assert.deepEqual(getFirstNLines(fileContent, 0), '');
  });

  it('should return 1 line when count is 1', () => {
    assert.deepEqual(getFirstNLines(fileContent, 1), '1');
  });

  it('should return 5 lines  when count is 5', () => {
    assert.deepEqual(getFirstNLines(fileContent, 5), '1\n2\n3\n4\n5');
  });
});

describe('getFirstNBytes', () => {
  const fileContent = [1,2,3,4,5,6,7,8,9,10].join('\n');
  it('should return 0 byte (empty string) when count is 0', () => {
    assert.deepEqual(getFirstNBytes(fileContent, 0), '');
  });

  it('should return 1 byte when count is 1', () => {
    assert.deepEqual(getFirstNBytes(fileContent, 1), '1');
  });

  it('should return 5 bytes  when count is 5', () => {
    assert.deepEqual(getFirstNBytes(fileContent, 5), '1\n2\n3');
  });
});

describe('isCountAboveZero', () => {
  it('should return false if count is 0', () => {
    assert.deepEqual(isCountAboveZero(0), false);
  });
  it('should return false if count is less than 0', () => {
    assert.deepEqual(isCountAboveZero(-1), false);
  });
  it('should return false if count is non integer value', () => {
    assert.deepEqual(isCountAboveZero('a'), false);
  });
  it('should return true if count is greater than 0', () => {
    assert.deepEqual(isCountAboveZero(1), true);
  });
  it('should return true if count is greater than 0', () => {
    assert.deepEqual(isCountAboveZero(10), true);
  });
});

describe('invalidCountMessage', () => {
  it('should return message with line and count', () => {
    assert.deepEqual(invalidCountMessage({ command: 'head', type: 'n', count: -1 }), 'head: illegal line count -- -1');
  });

  it('should return message with line and count', () => {
    assert.deepEqual(invalidCountMessage({ command: 'head', type: 'c', count: -1 }), 'head: illegal byte count -- -1');
  });

  it('should return message with line and count', () => {
    assert.deepEqual(invalidCountMessage({ command: 'tail', type: 'n', count: -1 }), 'tail: illegal offset -- -1');
  });

  it('should return message with line and count', () => {
    assert.deepEqual(invalidCountMessage({ command: 'tail', type: 'c', count: -1 }), 'tail: illegal offset -- -1');
  });
});

describe('displayUsage', () => {
  it('should return head usage message with type', () => {
    assert.deepEqual(displayUsage({ command: 'head', type: 'p'}), 'head: illegal option -- p\nusage: head [-n lines | -c bytes] [file ...]');
  });
  it('should return tail usage message with type', () => {
    assert.deepEqual(displayUsage({ command: 'tail', type: '-'}), 'tail: illegal option -- -\nusage: tail [-F | -f | -r] [-q] [-b # | -c # | -n #] [file ...]');
  });
});

describe('runCommand', () => {
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
        assert.deepEqual(runCommand(fileDetails, { type : 'n', count : 0, command: 'head' }), '');
      });

      it('should return one line when input line is 1 and only file passed', () => {
        assert.deepEqual(runCommand(fileDetails, { type : 'n', count : 1, command: 'head' }), 'This is the first Line.');
      });

      it('should return all content of file when input line is greater than total file line length and only file passed', () => {
        assert.deepEqual(runCommand(fileDetails, { type : 'n', count : 10, command: 'head' }), 'This is the first Line.\nSecond Line\n1234\nEND');
      });

      it('should return empty string when input character count is 0 and only file passed', () => {
        assert.deepEqual(runCommand(fileDetails, { type : 'c', count : 0, command: 'head' }), '');
      });

      it('should return one character when input character count is 1 and only file passed', () => {
        assert.deepEqual(runCommand(fileDetails, { type : 'c', count : 1, command: 'head' }), 'T');
      });

      it('should return all content of file when input character count is greater than total file characters length and only file passed', () => {
        assert.deepEqual(runCommand(fileDetails, { type : 'c', count : 100, command: 'head' }), 'This is the first Line.\nSecond Line\n1234\nEND');
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
        assert.deepEqual(runCommand(fileDetails1, { type : 'n', count : 1 , command: 'head' }), '==> testFile1 <==\nThis is the first Line.\n\n==> testFile2 <==\nOne');
      });

      it('should return all lines from two files with their name as heading when input line is greater than line count of files and files are 2', () => {
        assert.deepEqual(runCommand(fileDetails1, { type : 'n', count : 10, command: 'head'  }), '==> testFile1 <==\nThis is the first Line.\nSecond Line\n1234\nEND\n\n==> testFile2 <==\nOne\nTwo\nThree\n');
      });

      it('should return one character from two files with their name as heading when input character count is 1 and files are 2', () => {
        assert.deepEqual(runCommand(fileDetails1, { type : 'c', count : 1 , command: 'head' }), '==> testFile1 <==\nT\n\n==> testFile2 <==\nO');
      });

      it('should return all characters from two files with their name as heading when input character count is greater than total character length of files and files are 2', () => {
        assert.deepEqual(runCommand(fileDetails1, { type : 'c', count : 10, command: 'head'  }), '==> testFile1 <==\nThis is th\n\n==> testFile2 <==\nOne\nTwo\nTh');
      });
    });
  });

  describe('tail', () => {
    describe('tail with one file', ()=> {
      let fileDetails = [
        { 
          content : 'This is the first Line.\nSecond Line\n1234\nEND',
          file : 'testFile',
          isExists : true 
        }
      ];

      it('should return empty string when input line is 0 and only file passed', () => {
        assert.deepEqual(runCommand(fileDetails, { type : 'n', count : 0, command: 'tail' }), '');
      });

      it('should return one line when input line is 1 and only file passed', () => {
        assert.deepEqual(runCommand(fileDetails, { type : 'n', count : 1, command: 'tail' }), '.eniL tsrif eht si sihT');
      });

      it('should return all content of file when input line is greater than total file line length and only file passed', () => {
        assert.deepEqual(runCommand(fileDetails, { type : 'n', count : 10, command: 'tail' }), 'DNE\n4321\neniL dnoceS\n.eniL tsrif eht si sihT');
      });

      it('should return empty string when input character count is 0 and only file passed', () => {
        assert.deepEqual(runCommand(fileDetails, { type : 'c', count : 0, command: 'tail' }), '');
      });

      it('should return one character when input character count is 1 and only file passed', () => {
        assert.deepEqual(runCommand(fileDetails, { type : 'c', count : 1, command: 'tail' }), 'T');
      });

      it('should return all content of file when input character count is greater than total file characters length and only file passed', () => {
        assert.deepEqual(runCommand(fileDetails, { type : 'c', count : 100, command: 'tail' }), 'DNE\n4321\neniL dnoceS\n.eniL tsrif eht si sihT');
      });
    });

    describe('tail with more than one file', ()=> {
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
      it('should return one line from two files with their name as heading   when input line is 1 and files are 2', () => {
        assert.deepEqual(runCommand(fileDetails1, { type : 'n', count : 1 , command: 'tail'}), '==> testFile1 <==\n.eniL tsrif eht si sihT\n\n==> testFile2 <==\nenO');
      });

      it('should return all lines from two files with their name as heading when input line is greater than line count of files and files are 2', () => {
        assert.deepEqual(runCommand(fileDetails1, { type : 'n', count : 10, command: 'tail' }), '==> testFile1 <==\nDNE\n4321\neniL dnoceS\n.eniL tsrif eht si sihT\n\n==> testFile2 <==\n\neerhT\nowT\nenO');
      });

      it('should return one character from two files with their name as heading when input character count is 1 and files are 2', () => {
        assert.deepEqual(runCommand(fileDetails1, { type : 'c', count : 1 , command: 'tail'}), '==> testFile1 <==\nT\n\n==> testFile2 <==\nO');
      });

      it('should return all characters from two files with their name as heading when input character count is greater than total character length of files and files are 2', () => {
        assert.deepEqual(runCommand(fileDetails1, { type : 'c', count : 10, command: 'tail' }), '==> testFile1 <==\nht si sihT\n\n==> testFile2 <==\nhT\nowT\nenO');
      });
    });
  });

  describe('selectOperation', () => {
    it('should return getFirstNLines function when option is n', () => {
      assert.deepEqual(selectOperation('n'), getFirstNLines);
    });

    it('should return getFirstNBytes function when option is c', () => {
      assert.deepEqual(selectOperation('c'), getFirstNBytes);
    });
  
    it('should return undefined when option is other than n or c', () => {
      assert.deepEqual(selectOperation('o'), undefined);
    });
  });

  describe('head', () => {
    describe('with one file only', () => {
      it('should return all lines from file when option & count is not given', () => {
        assert.deepEqual(head(fs, ['file1']), 'This is the content of file 1\nLine 2');
      });
      it('should return 1 line from file when option is n & line count is 1', () => {
        assert.deepEqual(head(fs, ['-n', '1', 'file1']), 'This is the content of file 1');
      });
      it('should return 1 byte from file when option is c & byte count is 1', () => {
        assert.deepEqual(head(fs, ['-c', '1', 'file1']), 'T');
      });
      it('should return error message if file not found', () => {
        assert.deepEqual(head(fs, ['-c', '1', 'myFile']), 'head: myFile: No such file or directory');
      });

    });

    describe('with more than one file', () => {
      it('should return all lines from file when option & count is not given', () => {
        assert.deepEqual(head(fs, ['file1', 'file2']), '==> file1 <==\nThis is the content of file 1\nLine 2\n\n==> file2 <==\nThis is the content of file 2');
      });
      it('should return 1 line from file when option is n & line count is 1', () => {
        assert.deepEqual(head(fs, ['-n', '1', 'file1', 'file2']), '==> file1 <==\nThis is the content of file 1\n\n==> file2 <==\nThis is the content of file 2');
      });
      it('should return 1 byte from file when option is c & byte count is 1', () => {
        assert.deepEqual(head(fs, ['-c', '1', 'file1', 'file2']), '==> file1 <==\nT\n\n==> file2 <==\nT');
      });
      it('should return error message if file not found', () => {
        assert.deepEqual(head(fs, ['-c', '1', 'myFile', 'myFile2']), 'head: myFile: No such file or directory\n\nhead: myFile2: No such file or directory');
      });
    });

    describe('error message and usage', () => {
      it('should return error message when count is less than 1 or not a number', () => {
        assert.deepEqual(head(fs, ['-n', '0', 'file1']), 'head: illegal line count -- 0');
      });
      it('should return usage message when option other than n or c is given', () => {
        assert.deepEqual(head(fs, ['-p', '0', 'file1']), 'head: illegal option -- p\nusage: head [-n lines | -c bytes] [file ...]');
      });
    });
  });

  describe('tail', () => {
    describe('with one file only', () => {
      it('should return all lines from file when option & count is not given', () => {
        assert.deepEqual(tail(fs, ['file1']), 'This is the content of file 1\nLine 2');
      });
      it('should return 1 line from file when option is n & line count is 1', () => {
        assert.deepEqual(tail(fs, ['-n', '1', 'file1']), 'Line 2');
      });
      it('should return 1 byte from file when option is c & byte count is 1', () => {
        assert.deepEqual(tail(fs, ['-c', '1', 'file1']), '2');
      });
      it('should return error message if file not found', () => {
        assert.deepEqual(tail(fs, ['-c', '1', 'myFile']), 'tail: myFile: No such file or directory');
      });

    });

    describe('with more than one file', () => {
      it('should return all lines from file when option & count is not given', () => {
        assert.deepEqual(tail(fs, ['file1', 'file2']), '==> file1 <==\nThis is the content of file 1\nLine 2\n\n==> file2 <==\nThis is the content of file 2');
      });
      it('should return 1 line from file when option is n & line count is 1', () => {
        assert.deepEqual(tail(fs, ['-n', '1', 'file1', 'file2']), '==> file1 <==\nLine 2\n\n==> file2 <==\nThis is the content of file 2');
      });
      it('should return 1 byte from file when option is c & byte count is 1', () => {
        assert.deepEqual(tail(fs, ['-c', '1', 'file1', 'file2']), '==> file1 <==\n2\n\n==> file2 <==\n2');
      });
      it('should return error message if file not found', () => {
        assert.deepEqual(tail(fs, ['-c', '1', 'myFile', 'myFile2']), 'tail: myFile: No such file or directory\n\ntail: myFile2: No such file or directory');
      });
    });

    describe('error message and usage', () => {
      it('should return error message when count is less than 1 or not a number', () => {
        assert.deepEqual(tail(fs, ['-n', '0', 'file1']), '');
      });
      it('should return usage message when option other than n or c is given', () => {
        assert.deepEqual(tail(fs, ['-p', '0', 'file1']), 'tail: illegal option -- p\nusage: tail [-F | -f | -r] [-q] [-b # | -c # | -n #] [file ...]');
      });
      it("should return error message when count is less than 1 or not a number", () => {
        assert.deepEqual(tail(fs, ["-n", "p", "file1"]), 'tail: illegal offset -- p');
      });
    });
  });
});

describe('selectFileContentOrder', () => {
  it('should return error message when count is less than 1 or not a number', () => {
    assert.deepEqual(selectFileContentOrder('head'), identity);
  });
  it('should return usage message when option other than n or c is given', () => {
    assert.deepEqual(selectFileContentOrder('tail'), reverseText);
  });
});

describe('isInvalidOption', () => {
  it('should return true when invalid type is given', () => {
    assert.deepEqual(isInvalidOption('p'), true);
  });
  it('should return false when valid type is given', () => {
    assert.deepEqual(isInvalidOption('n'), false);
  });
  it('should return false when valid type is given', () => {
    assert.deepEqual(isInvalidOption('c'), false);
  });
  it('should return true when no type is given', () => {
    assert.deepEqual(isInvalidOption(''), true);
  });
});