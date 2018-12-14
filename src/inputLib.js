const parseInput = function(arguments) {
  if(arguments[0][0] == '-') {
    return getHeadParameters(arguments);
  }
  return { 
    type : 'n', 
    count : 10, 
    files : arguments 
  };
}

const getHeadParameters = function(headParameters){
  if(isValidOption(headParameters[0])){
    return {
      type : headParameters[0][1],
      count : headParameters[1],
      files : headParameters.slice(2)
    };
  }

  if(!isNaN(Math.abs(headParameters[0]))){
    return {
      type : 'n',
      count : Math.abs(headParameters[0]),
      files : headParameters.slice(1)
    };
  }

  return {
    type : headParameters[0][1],
    count : headParameters[0].slice(2),
    files : headParameters.slice(1)
  };
}

const isValidOption = function(option) {
  return option == '-n' || option == '-c';
}

module.exports = {
    parseInput,
    getHeadParameters
  }
  