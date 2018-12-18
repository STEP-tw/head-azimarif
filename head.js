const fs = require('fs');

const { head } = require("./src/lib.js");

const main = function() {
  let inputArgs = process.argv.slice(2);
  let headResult = head(inputArgs, fs);
  console.log(headResult);
};

main();