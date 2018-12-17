File
inputLib.js
-------------
13-> optionArguments & getOptionDetails() - could have used better name

util.js
-------
7-> isValueString() - misleading name
15-> identity() - name could have been improved

fileLib.js
----------
5 -> misleading names

lib.js 
------
64-> invalidCountMessage: same property value could have been used
118-> filteredFileContent name could have been improved
131,136-> getFirstNLines &  getFirstNBytes - could have extracted into new function(split / join)


Arguments order:
13-> getFileDetails()

Test:
10 -> getFileHeading should have more diversed test cases

inputLibTest : 
could have used 'assert.deepEqual' instead of 'deepEqual'
parseInput-> no tests for negative count
isCountAboveZero-> tests order could have been improved


Suggestion: 
1. expected output should be extracted to a variable (Tests)
2. 'option' is command and type is option (lib,fileLib)