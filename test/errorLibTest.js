const { invalidCountMessage, displayUsage } = require("../src/errorLib.js");

const assert = require("assert");

describe("invalidCountMessage", () => {
  it("should return illegal line count message for head -n option", () => {
    let userInput = { command: "head", option: "n", count: -1 };
    let expectedOutput = "head: illegal line count -- -1";
    assert.deepEqual(invalidCountMessage(userInput), expectedOutput);
  });

  it("should return illegal byte count message for head -c option", () => {
    let userInput = { command: "head", option: "c", count: '-a' };
    let expectedOutput = "head: illegal byte count -- -a";
    assert.deepEqual(invalidCountMessage(userInput), expectedOutput);
  });

  it("should return illegal offset for tail -n option", () => {
    let userInput = { command: "tail", option: "n", count: -1 };
    let expectedOutput = "tail: illegal offset -- -1";
    assert.deepEqual(invalidCountMessage(userInput), expectedOutput);
  });

  it("should return illegal offset for tail -c option", () => {
    let userInput = { command: "tail", option: "c", count: 'p' };
    let expectedOutput = "tail: illegal offset -- p";
    assert.deepEqual(invalidCountMessage(userInput), expectedOutput);
  });
});

describe("displayUsage", () => {
  it("should return head usage message with option", () => {
    let expectedOutput =
      "head: illegal option -- p\n" +
      "usage: head [-n lines | -c bytes] [file ...]";
    assert.deepEqual(displayUsage({ command: "head", option: "p" }), expectedOutput);
  });

  it("should return tail usage message with option", () => {
    let expectedOutput =
      "tail: illegal option -- a\n" +
      "usage: tail [-F | -f | -r] [-q] [-b # | -c # | -n #] [file ...]";
    assert.deepEqual(displayUsage({ command: "tail", option: "a" }), expectedOutput);
  });
});