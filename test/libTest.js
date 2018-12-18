const {
  getFirstNLines,
  getFirstNBytes,
  isCountAboveZero,
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
  file1: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].join('\n'),
  file2: [9, 8, 7, 6, 5, 4, 3, 2, 1, 0].join('\n')
}

const fs = {
  existsSync: (file) => {
    return files.hasOwnProperty(file);
  },
  readFileSync: (file) => {
    return files[file];
  }
}

describe('getFirstNLines', () => {
  const fileContent = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].join('\n');
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
  const fileContent = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].join('\n');
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

describe('runCommand', () => {
  describe('head', () => {
    describe('head with one file', () => {
      let fileDetails = [
        {
          content: 'This is the first Line.\nSecond Line\n1234\nEND',
          file: 'testFile',
          isExists: true
        }
      ];

      it('should return empty string when input line is 0 and only file passed', () => {
        let userInput = { option: 'n', count: 0, command: 'head' };
        assert.deepEqual(runCommand(fileDetails, userInput), '');
      });

      it('should return one line when input line is 1 and only file passed', () => {
        let userInput = { option: 'n', count: 1, command: 'head' };
        assert.deepEqual(runCommand(fileDetails, userInput), 'This is the first Line.');
      });

      it('should return all content of file when input line is greater than total file line length and only file passed', () => {
        let userInput = { option: 'n', count: 10, command: 'head' };
        let expectedOutput = 'This is the first Line.\nSecond Line\n1234\nEND';
        assert.deepEqual(runCommand(fileDetails, userInput), expectedOutput);
      });

      it('should return empty string when input character count is 0 and only file passed', () => {
        let userInput = { option: 'c', count: 0, command: 'head' };
        assert.deepEqual(runCommand(fileDetails, userInput), '');
      });

      it('should return one character when input character count is 1 and only file passed', () => {
        let userInput = { option: 'c', count: 1, command: 'head' };
        assert.deepEqual(runCommand(fileDetails, userInput), 'T');
      });

      it('should return all content of file when input character count is greater than total file characters length and only file passed', () => {
        let userInput = { option: 'c', count: 100, command: 'head' };
        let expectedOutput = 'This is the first Line.\nSecond Line\n1234\nEND';
        assert.deepEqual(runCommand(fileDetails, userInput), expectedOutput);
      });
    });

    describe('head with more than one file', () => {
      let fileDetails1 = [
        {
          content: 'This is the first Line.\nSecond Line\n1234\nEND',
          name: 'File1.txt',
          isExists: true
        },
        {
          content: 'One\nTwo\nThree\n',
          name: 'File2.txt',
          isExists: true
        }
      ];

      it('should return one line from two files with their name as heading when input line is 1 and files are 2', () => {
        let userInput = { option: 'n', count: 1, command: 'head' };
        let expectedOutput = '==> File1.txt <==\nThis is the first Line.\n\n==> File2.txt <==\nOne';
        assert.deepEqual(runCommand(fileDetails1, userInput), expectedOutput);
      });

      it('should return all lines from two files with their name as heading when input line is greater than line count of files and files are 2', () => {
        let userInput = { option: 'n', count: 10, command: 'head' };
        let expectedOutput = '==> File1.txt <==\nThis is the first Line.\nSecond Line\n1234\nEND\n\n==> File2.txt <==\nOne\nTwo\nThree\n';
        assert.deepEqual(runCommand(fileDetails1, userInput), expectedOutput);
      });

      it('should return one character from two files with their name as heading when input character count is 1 and files are 2', () => {
        let userInput = { option: 'c', count: 1, command: 'head' };
        let expectedOutput = '==> File1.txt <==\nT\n\n==> File2.txt <==\nO';
        assert.deepEqual(runCommand(fileDetails1, userInput), expectedOutput);
      });

      it('should return all characters from two files with their name as heading when input character count is greater than total character length of files and files are 2', () => {
        let userInput = { option: 'c', count: 10, command: 'head' };
        let expectedOutput = '==> File1.txt <==\nThis is th\n\n==> File2.txt <==\nOne\nTwo\nTh';
        assert.deepEqual(runCommand(fileDetails1, userInput), expectedOutput);
      });
    });
  });

  describe('tail', () => {
    describe('tail with one file', () => {
      let fileDetails = [
        {
          content: 'This is the first Line.\nSecond Line\n1234\nEND',
          file: 'testFile',
          isExists: true
        }
      ];

      it('should return empty string when input line is 0 and only file passed', () => {
        let userInput = { option: 'n', count: 0, command: 'tail' };
        assert.deepEqual(runCommand(fileDetails, userInput), '');
      });

      it('should return one line when input line is 1 and only file passed', () => {
        let userInput = { option: 'n', count: 1, command: 'tail' };
        let expectedOutput = '.eniL tsrif eht si sihT';
        assert.deepEqual(runCommand(fileDetails, userInput), expectedOutput);
      });

      it('should return all content of file when input line is greater than total file line length and only file passed', () => {
        let userInput = { option: 'n', count: 10, command: 'tail' };
        let expectedOutput = 'DNE\n4321\neniL dnoceS\n.eniL tsrif eht si sihT';
        assert.deepEqual(runCommand(fileDetails, userInput), expectedOutput);
      });

      it('should return empty string when input character count is 0 and only file passed', () => {
        let userInput = { option: 'c', count: 0, command: 'tail' };
        assert.deepEqual(runCommand(fileDetails, userInput), '');
      });

      it('should return one character when input character count is 1 and only file passed', () => {
        let userInput = { option: 'c', count: 1, command: 'tail' };
        assert.deepEqual(runCommand(fileDetails, userInput), 'T');
      });

      it('should return all content of file when input character count is greater than total file characters length and only file passed', () => {
        let userInput = { option: 'c', count: 100, command: 'tail' };
        let expectedOutput = 'DNE\n4321\neniL dnoceS\n.eniL tsrif eht si sihT';
        assert.deepEqual(runCommand(fileDetails, userInput), expectedOutput);
      });
    });

    describe('tail with more than one file', () => {
      let fileDetails1 = [
        {
          content: 'This is the first Line.\nSecond Line\n1234\nEND',
          name: 'File1.txt',
          isExists: true
        },
        {
          content: 'One\nTwo\nThree\n',
          name: 'File2.txt',
          isExists: true
        }
      ];

      it('should return one line from two files with their name as heading   when input line is 1 and files are 2', () => {
        let userInput = { option: 'n', count: 1, command: 'tail' };
        let expectedOutput = '==> File1.txt <==\n.eniL tsrif eht si sihT\n\n==> File2.txt <==\nenO';
        assert.deepEqual(runCommand(fileDetails1, userInput), expectedOutput);
      });

      it('should return all lines from two files with their name as heading when input line is greater than line count of files and files are 2', () => {
        let userInput = { option: 'n', count: 10, command: 'tail' };
        let expectedOutput = '==> File1.txt <==\nDNE\n4321\neniL dnoceS\n.eniL tsrif eht si sihT\n\n==> File2.txt <==\n\neerhT\nowT\nenO';
        assert.deepEqual(runCommand(fileDetails1, userInput), expectedOutput);
      });

      it('should return one character from two files with their name as heading when input character count is 1 and files are 2', () => {
        let userInput = { option: 'c', count: 1, command: 'tail' };
        let expectedOutput = '==> File1.txt <==\nT\n\n==> File2.txt <==\nO';
        assert.deepEqual(runCommand(fileDetails1, userInput), expectedOutput);
      });

      it('should return all characters from two files with their name as heading when input character count is greater than total character length of files and files are 2', () => {
        let userInput = { option: 'c', count: 10, command: 'tail' };
        let expectedOutput = '==> File1.txt <==\nht si sihT\n\n==> File2.txt <==\nhT\nowT\nenO';
        assert.deepEqual(runCommand(fileDetails1, userInput), expectedOutput);
      });
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
      let expectedOutput = '1\n2\n3\n4\n5\n6\n7\n8\n9\n10';
      assert.deepEqual(head(['file1'], fs), expectedOutput);
    });

    it('should return 1 line from file when option is n & line count is 1', () => {
      assert.deepEqual(head(['-n', '1', 'file1'], fs), '1');
    });

    it('should return 1 byte from file when option is c & byte count is 1', () => {
      assert.deepEqual(head(['-c', '1', 'file1'], fs), '1');
    });

    it('should return error message if file not found', () => {
      assert.deepEqual(head(['-c', '1', 'myFile'], fs), 'head: myFile: No such file or directory');
    });
  });

  describe('with more than one file', () => {
    it('should return all lines from file when option & count is not given', () => {
      let expectedOutput = '==> file1 <==\n1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n\n==> file2 <==\n9\n8\n7\n6\n5\n4\n3\n2\n1\n0';
      assert.deepEqual(head(['file1', 'file2'], fs), expectedOutput);
    });

    it('should return 1 line from file when option is n & line count is 1', () => {
      let expectedOutput = '==> file1 <==\n1\n\n==> file2 <==\n9';
      assert.deepEqual(head(['-n', '1', 'file1', 'file2'], fs), expectedOutput);
    });

    it('should return 1 byte from file when option is c & byte count is 1', () => {
      let expectedOutput = '==> file1 <==\n1\n\n==> file2 <==\n9';
      assert.deepEqual(head(['-c', '1', 'file1', 'file2'], fs), expectedOutput);
    });

    it('should return error message if file not found', () => {
      assert.deepEqual(head(['-c', '1', 'myFile', 'myFile2'], fs), 'head: myFile: No such file or directory\n\nhead: myFile2: No such file or directory');
    });
  });

  describe('error message and usage', () => {
    it('should return error message when count is less than 1 or not a number', () => {
      assert.deepEqual(head(['-n', '0', 'file1'], fs), 'head: illegal line count -- 0');
    });

    it('should return usage message when option other than n or c is given', () => {
      let expectedOutput = 'head: illegal option -- p\n' +
        'usage: head [-n lines | -c bytes] [file ...]';
      assert.deepEqual(head(['-p', '0', 'file1'], fs), expectedOutput);
    });
  });
});

describe('tail', () => {
  describe('with one file only', () => {
    it('should return all lines from file when option & count is not given', () => {
      let expectedOutput = '4\n5\n6\n7\n8\n9\n10\n11\n12\n13';
      assert.deepEqual(tail(['file1'], fs), expectedOutput);
    });

    it('should return 1 line from file when option is n & line count is 1', () => {
      assert.deepEqual(tail(['-n', '1', 'file1'], fs), '13');
    });

    it('should return 1 byte from file when option is c & byte count is 1', () => {
      assert.deepEqual(tail(['-c', '1', 'file1'], fs), '3');
    });

    it('should return error message if file not found', () => {
      assert.deepEqual(tail(['-c', '1', 'myFile'], fs), 'tail: myFile: No such file or directory');
    });
  });

  describe('with more than one file', () => {
    it('should return all lines from file when option & count is not given', () => {
      let expectedOutput = '==> file1 <==\n4\n5\n6\n7\n8\n9\n10\n11\n12\n13\n\n==> file2 <==\n9\n8\n7\n6\n5\n4\n3\n2\n1\n0';
      assert.deepEqual(tail(['file1', 'file2'], fs), expectedOutput);
    });

    it('should return 1 line from file when option is n & line count is 1', () => {
      let expectedOutput = '==> file1 <==\n13\n\n==> file2 <==\n0';
      assert.deepEqual(tail(['-n', '1', 'file1', 'file2'], fs), expectedOutput);
    });

    it('should return 1 byte from file when option is c & byte count is 1', () => {
      let expectedOutput = '==> file1 <==\n3\n\n==> file2 <==\n0';
      assert.deepEqual(tail(['-c', '1', 'file1', 'file2'], fs), expectedOutput);
    });

    it('should return error message if file not found', () => {
      let expectedOutput = 'tail: myFile: No such file or directory\n\ntail: myFile2: No such file or directory';
      assert.deepEqual(tail(['-c', '1', 'myFile', 'myFile2'], fs), expectedOutput);
    });
  });

  describe('error message and usage', () => {
    it('should return error message when count is less than 1 or not a number', () => {
      assert.deepEqual(tail(['-n', '0', 'file1'], fs), '');
    });

    it('should return usage message when option other than n or c is given', () => {
      let expectedOutput = 'tail: illegal option -- p\n' +
        'usage: tail [-F | -f | -r] [-q] [-b # | -c # | -n #] [file ...]';
      assert.deepEqual(tail(['-p', '0', 'file1'], fs), expectedOutput);
    });

    it("should return error message when count is less than 1 or not a number", () => {
      assert.deepEqual(tail(["-n", "p", "file1"], fs), 'tail: illegal offset -- p');
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