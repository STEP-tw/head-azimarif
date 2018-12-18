const { invalidCountMessage, displayUsage } = require("../src/errorLib.js");

const assert = require("assert");

describe("invalidCountMessage", () => {
  it("should return message with line and count", () => {
    let expectedOutput = "head: illegal line count -- -1";
    assert.deepEqual(
      invalidCountMessage({ command: "head", option: "n", count: -1 }),
      expectedOutput
    );
  });

  it("should return message with line and count", () => {
    let expectedOutput = "head: illegal byte count -- -1";
    assert.deepEqual(
      invalidCountMessage({ command: "head", option: "c", count: -1 }),
      expectedOutput
    );
  });

  it("should return message with line and count", () => {
    let expectedOutput = "tail: illegal offset -- -1";
    assert.deepEqual(
      invalidCountMessage({ command: "tail", option: "n", count: -1 }),
      expectedOutput
    );
  });

  it("should return message with line and count", () => {
    let expectedOutput = "tail: illegal offset -- -1";
    assert.deepEqual(
      invalidCountMessage({ command: "tail", option: "c", count: -1 }),
      expectedOutput
    );
  });
});

describe("displayUsage", () => {
  it("should return head usage message with type", () => {
    let expectedOutput =
      "head: illegal option -- p\n" +
      "usage: head [-n lines | -c bytes] [file ...]";
    assert.deepEqual(
      displayUsage({ command: "head", option: "p" }),
      expectedOutput
    );
  });

  it("should return tail usage message with type", () => {
    let expectedOutput =
      "tail: illegal option -- -\n" +
      "usage: tail [-F | -f | -r] [-q] [-b # | -c # | -n #] [file ...]";
    assert.deepEqual(
      displayUsage({ command: "tail", option: "-" }),
      expectedOutput
    );
  });
});