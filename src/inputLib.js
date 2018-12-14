const parseInput = function(arguments) {
  if(arguments[0][0] == '-') {
    return getOptionDetails(arguments);
  }
  return { 
    type : 'n', 
    count : 10, 
    files : arguments 
  };
}

const getOptionDetails = function(optionArguments){
  if(isValidOption(optionArguments[0])){
    return {
      type : optionArguments[0][1],
      count : optionArguments[1],
      files : optionArguments.slice(2)
    };
  }

  if(!isNaN(Math.abs(optionArguments[0]))){
    return {
      type : 'n',
      count : Math.abs(optionArguments[0]),
      files : optionArguments.slice(1)
    };
  }

  return {
    type : optionArguments[0][1],
    count : optionArguments[0].slice(2),
    files : optionArguments.slice(1)
  };
}

const isValidOption = function(option) {
  return option == '-n' || option == '-c';
}

module.exports = {
    parseInput,
    getOptionDetails
  }
  