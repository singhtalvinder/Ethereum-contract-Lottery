// Don't add the require way of adding inbox.sol 
// since that way it takes the js files to execute.
// And since these are sol files we need no follow this.
// Rather use:
// Read the contents of the sol files.

const path = require('path'); // for cross platform compatibility. Inbuilt.
const fs = require('fs');  // inbuilt.
const solc = require('solc'); // Solidity compiler.

const LotteryPath = path.resolve(__dirname, 'contracts', 'Lottery.sol');

// read the source code from .sol file.
const source = fs.readFileSync(LotteryPath, 'utf8');

// console .log to test  the output is getting generated or not. 
//console.log(solc.compile(source, 1));

// To make it accessible to other files.
// Need to export the -Inbox(class- bytecode and abi) to others.
module.exports = solc.compile(source, 1).contracts[':Lottery'];

