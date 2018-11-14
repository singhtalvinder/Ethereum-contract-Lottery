// Don't add the require way of adding inbox.sol 
// since that way it takes the js files to execute.
// And since these are sol files we need no follow this.
// Rather use:
// Read the contents of the sol files.

const path = require('path'); // for cross platform compatibility. Inbuilt.
const fs = require('fs');  // inbuilt.
const solc = require('solc'); // Solidity compiler.

const inboxPath = path.resolve(__dirname, 'contracts', 'inbox.sol');

// read the source code from .sol file.
const source = fs.readFileSync(inboxPath, 'utf8');

console.log(solc.compile(source, 1));
