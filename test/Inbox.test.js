const assert = require('assert'); // standard lib, no seperate install needed.
const ganache = require('ganache-cli'); // for local testrpc.
// Also, automatically creates some accounts to use in test n/w as soon as the
// test n/w boots up. And these accounts are created in an unlocked state ie, we 
// don't need to do anything with any of the private/public keys or
// sending/receiving any ether to make access to.

const Web3 = require('web3'); // is a constructor fn or Class so is CAPITAL and
                              // used to create instances of web3 lib.
// we can create multiple instances of Web3 to connect to different Ethereum networks.

const provider = ganache.provider();// compatible with latest releases.
const web3 = new Web3(provider); // connect to the local test n/w. on our machine.

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
let inbox; // this object represents what is there on the blockchain.

const INITIAL_MESSAGE = "Hi there";

// Better way is to use Async await syntax for the above method.
beforeEach(async ()=>{
    // get a list of all accounts.
    // web3 methods are mostly async and this return a promise.
    
    accounts = await web3.eth.getAccounts();
    // use of these to deploy contract. And for that we need access to the 
    // bytecode.
    inbox = await new web3.eth.Contract(JSON.parse(interface)) // tells web3 about
                                                  // what methods an Inbox contract has.
                                                  // Contract is a contructor fn.
    .deploy({ // Tells web3 that we want to deploy a new copy of this contract.
              // with the given arguments.
        data: bytecode, // bytecode
        arguments: [INITIAL_MESSAGE] // initial message, its an array to accomodate more args
                                // to the constructor fn of contract.
    })
    .send({ // Instructs web3 to send out a transaction that creates this contract.
        from: accounts[0], // the first account from all.
        gas: '1000000' // gas .
    });

    inbox.setProvider(provider);
    /*
    simple syntax:
    inbox = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({data: bytecode, arguments: ['Hi there']})
    .send({from: accounts[0], gas: '1000000'});
    */
});

describe('Inbox', () => {
    it('deploys a contract', () => {
        //console.log(inbox);
        // std node library.
        assert.ok(inbox.options.address);
    });

    it('has a default message', async() => {
        const message = await inbox.methods.message().call();// Call is read operations.
        assert.equal(message, INITIAL_MESSAGE);
    });

    it('can change the message', async() => {
        // transaction methods return a transation hash back.
        await inbox.methods.setMessage('Updated').send( // send is a transaction operation.
            // specify who will pay the gas for the modifier method.
            {from: accounts[0]}
            );
        
        // Get the updated message back.
        const message = await inbox.methods.message().call();
        assert.equal(message, 'Updated');
    });
});
