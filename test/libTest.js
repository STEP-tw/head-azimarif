const {
  getFirstNLines,
  getFirstNBytes,
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
      let expectedOutput = 'head: myFile: No such file or directory\n\nhead: myFile2: No such file or directory';
      assert.deepEqual(head(['-c', '1', 'myFile', 'myFile2'], fs), expectedOutput);
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
  it('should return true when invalid option is given', () => {
    assert.deepEqual(isInvalidOption('p'), true);
  });

  it('should return false when valid option is given', () => {
    assert.deepEqual(isInvalidOption('n'), false);
  });

  it('should return false when valid option is given', () => {
    assert.deepEqual(isInvalidOption('c'), false);
  });

  it('should return true when no option is given', () => {
    assert.deepEqual(isInvalidOption(''), true);
  });
});