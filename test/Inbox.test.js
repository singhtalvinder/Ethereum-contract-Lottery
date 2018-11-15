const assert = require('assert'); // standard lib, no seperate install needed.
const ganache = require('ganache-cli'); // for local testrpc.
// Also, automatically creates some accounts to use in test n/w as soon as the
// test n/w boots up. And these accounts are created in an unlocked state ie, we 
// don't need to do anything with any of the private/public keys or
// sending/receiving any ether to make access to.

const Web3 = require('web3'); // is a constructor fn or Class so is CAPITAL and
                              // used to create instances of web3 lib.
// we can create multiple instances of Web3 to connect to different Ethereum networks.

const web3 = new Web3(ganache.provider()); // connect to the local test n/w. on our machine.
//To get access to the abi and bytecode fom contract 'Inbox'.
const {interface, bytecode} = require('../compile'); 

/*
beforeEach(()=>{
    // get a list of all accounts.
    // web3 methods are mostly async and this return a promise.
    
    web3.eth.getAccounts()
    .then(fetchedAccounts =>{
        console.log('Accounts fetched:', fetchedAccounts);
    });

    // use of these to deploy contract.
});*/

let accounts;
let inbox;
// Better way is to use Async await syntax for the above method.
beforeEach(async ()=>{
    // get a list of all accounts.
    // web3 methods are mostly async and this return a promise.
    
    accounts = await web3.eth.getAccounts();
    // use of these to deploy contract. And for that we need access to the 
    // bytecode.
    inbox = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({
        data: bytecode, // bytecode
        arguments: ['Hi there'] // initial message
    })
    .send({
        from: accounts[0], // the first account from all.
        gas: '1000000' // gas .
    });
});

describe('Inbox', () => {
    it('deploys a contract', () =>{
        console.log(inbox);

    });
});
