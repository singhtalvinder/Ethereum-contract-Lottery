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

let accounts;
let lottery; // this object represents what is there on the blockchain.

// Better way is to use Async await syntax for the above method.
beforeEach(async ()=>{
    // get a list of all accounts.
    // web3 methods are mostly async and this return a promise.
    
    accounts = await web3.eth.getAccounts();
    // use of these to deploy contract. And for that we need access to the 
    // bytecode.
    lottery = await new web3.eth.Contract(JSON.parse(interface)) // tells web3 about
                                                  // what methods an Inbox contract has.
                                                  // Contract is a contructor fn.
    .deploy({ // Tells web3 that we want to deploy a new copy of this contract.
              // with the given arguments.
        data: bytecode })// bytecode                                      
    .send({ // Instructs web3 to send out a transaction that creates this contract.
        from: accounts[0], // the first account from all.
        gas: '1000000' // gas .
    });

    lottery.setProvider(provider);
});

describe('Lottery Contract', () => {
    it('deploys a contract', () => {
        //console.log(lottery); -- handy to see what all it is.
        // std node library.
        assert.ok(lottery.options.address);
    });

    it('allows an account to enter', async() => {
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('0.02', 'ether')
        });
        
        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]});
        
        assert.equal(accounts[0], players[0]);
        assert.equal(1, players.length);
    });

    it('allows multiple accounts to enter', async() => {
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('0.02', 'ether')
        });
        await lottery.methods.enter().send({
            from: accounts[1],
            value: web3.utils.toWei('0.02', 'ether')
        });
        await lottery.methods.enter().send({
            from: accounts[2],
            value: web3.utils.toWei('0.02', 'ether')
        });
        
        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        });
        
        assert.equal(accounts[0], players[0]);
        assert.equal(accounts[1], players[1]);
        assert.equal(accounts[2], players[2]);
        assert.equal(3, players.length);
    });
    
    it('requires a minimum amount of ether to enter into contract', async() => {
        // transaction methods return a transation hash back.
        try{
            await lottery.methods.enter().send({
                from: accounts[0],
                value:0 // failure case should throw error, caught in catch block.
            });
            assert(false);
        } catch (err) {
            assert(err); // assert an err is present. 
        }
    });

    it('Only manager can call pickWinner', async() => {
        await lottery.methods.enter().send({
            from: accounts[0],
            value:web3.utils.toWei('0.02', 'ether')
        });
        try{
            await lottery.methods.pickWinner().send({
                from: accounts[0]
            });
            //console.log('last line of try ....');
            assert(false);
        }
        catch(err) {
            console.log('Inside catch', err);
            assert(err);
        }
    });

    it('Send money to the winner and resets the players array', async() => {
        // used only 1-player to avoid random realted stuff
        await lottery.methods.enter().send({
            from : accounts[0],
            value: web3.utils.toWei('2', 'ether')
        });

        const initialBalance = await web3.eth.getBalance(accounts[0]);
        
        await lottery.methods.pickWinner().send({
            from: accounts[0]
        });

        const finalBalance = await web3.eth.getBalance(accounts[0]);
        
        const difference = finalBalance - initialBalance;
        console.log('Difference', difference);
        
        // consider the usage of gas as well since  initial and final will not be same.
        assert(difference > web3.utils.toWei('1.8', 'ether'));
        
    });
});
