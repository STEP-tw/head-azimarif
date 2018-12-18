const { parseInput } = require("../src/inputLib.js");
const assert = require("assert");

describe("parseInput", () => {
  it("should return object with type n, count 10 and fileName in files array when only file name is passed as input", () => {
    let expectedOutput = {
      option: "n",
      count: 10,
      files: ["file1.txt"]
    };
    assert.deepEqual(parseInput(["file1.txt"]), expectedOutput);
  });

  it("should return object with type n, count 10 and fileName in files array when multiple file name is passed as input", () => {
    let expectedOutput = {
      option: "n",
      count: 10,
      files: ["file1.txt", "file2.txt", "file3.txt"]
    };
    assert.deepEqual(parseInput(["file1.txt", "file2.txt", "file3.txt"]), expectedOutput);
  });

  it("should return an object with type n and count, fileName in files array while passing the count & fileName as input", () => {
    let expectedOutput = {
      option: "n",
      count: 0,
      files: ["file1.txt"]
    };
    assert.deepEqual(parseInput(["-0", "file1.txt"]), expectedOutput);

    expectedOutput = {
      option: "n",
      count: 1,
      files: ["file1.txt", "file2.txt", "file3.txt"]
    };
    assert.deepEqual(parseInput(["-1", "file1.txt", "file2.txt", "file3.txt"]), expectedOutput);

    expectedOutput = {
      option: "n",
      count: 100,
      files: ["file1.txt", "file2.txt", "file3.txt"]
    };
    assert.deepEqual(parseInput(["-100", "file1.txt", "file2.txt", "file3.txt"]), expectedOutput);
  });

  it("should return an object of type, count and fileNames when all three arguments are passed", () => {
    let expectedOutput = {
      option: "n",
      count: 1,
      files: ["file1.txt"]
    };
    assert.deepEqual(parseInput(["-n1", "file1.txt"]), expectedOutput);

    expectedOutput = {
      option: "n",
      count: 1,
      files: ["file1.txt", "file2.txt"]
    };
    assert.deepEqual(parseInput(["-n1", "file1.txt", "file2.txt"]), expectedOutput);

    expectedOutput = {
      option: "n",
      count: 1,
      files: ["file1.txt"]
    };
    assert.deepEqual(parseInput(["-n", "1", "file1.txt"]), expectedOutput);

    expectedOutput = {
      option: "n",
      count: 1,
      files: ["file1.txt", "file2.txt"]
    };
    assert.deepEqual(parseInput(["-n", "1", "file1.txt", "file2.txt"]), expectedOutput);

    expectedOutput = {
      option: "c",
      count: 1,
      files: ["file1.txt"]
    };
    assert.deepEqual(parseInput(["-c1", "file1.txt"]), expectedOutput);

    expectedOutput = {
      option: "c",
      count: 1,
      files: ["file1.txt", "file2.txt"]
    };
    assert.deepEqual(parseInput(["-c1", "file1.txt", "file2.txt"]),expectedOutput);

    expectedOutput = {
      option: "c",
      count: 1,
      files: ["file1.txt"]
    };
    assert.deepEqual(parseInput(["-c", "1", "file1.txt"]), expectedOutput);

    expectedOutput = {
      option: "c",
      count: 1,
      files: ["file1.txt", "file2.txt"]
    };
    assert.deepEqual(parseInput(["-c", "1", "file1.txt", "file2.txt"]), expectedOutput);
  });
});