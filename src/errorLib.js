const displayUsage = function (messageParameters) {
  let { option, command } = messageParameters;
  let usageMessage = {
    head: "head: illegal option -- " + option +
      "\nusage: head [-n lines | -c bytes] [file ...]",
    tail: "tail: illegal option -- " + option +
      "\nusage: tail [-F | -f | -r] [-q] [-b # | -c # | -n #] [file ...]"
  };
  return usageMessage[command];
};

const invalidCountMessage = function (messageParameters) {
  let { command, option, count } = messageParameters;
  let optionType = {
    n: 'line',
    c: 'byte'
  }
  let invalidMessage = {
    head: 'head: illegal ' + optionType[option] + ' count -- ' + count,
    tail: 'tail: illegal offset -- ' + count
  };
  return invalidMessage[command];
};

module.exports = {
  displayUsage,
  invalidCountMessage
}