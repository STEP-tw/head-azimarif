const fs = require('fs');

const { tail } = require("./src/lib.js");

const main = function() {
  let inputArgs = process.argv.slice(2);
  let tailResult = tail(inputArgs, fs);
  console.log(tailResult);
};

main();