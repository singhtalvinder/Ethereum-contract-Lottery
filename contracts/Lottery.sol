pragma solidity ^0.4.24;

contract Lottery {
    address public manager; // The one who owns the contract
    // Should only be able to pick a winner. no one else.
    
    address[] public players; //dynamic array of addresses.
    
    //function Lottery() public { // depricated
    constructor() public{
        // This method should use some programmatic way 
        // to get address of the owner(the one who creates the contract).
        manager = msg.sender; // msg is a global variable and is accessible
                             // in any function of the contract.
    }
    
    function enter() public payable{
        // global func call for validation of expression.
        // mg.value is the amount of ether that was sent along with 
        // the func invocation.
        // since msg.value is in wei, we need to convert it to ether
        // for condition. Or specify ether with the amount.
        require(msg.value > 0.01 ether);// 10000000000000000 in wei
        
        // Add the player to the list of addresses who are playing.
        players.push(msg.sender);
    }
    
    // There is no such thing as random number generator in solidity.
    // So Just for an example : --THIS WOULD NOT BE IN PRODUCTION code.--
    // to pick a random winner- we will write pseudo number generator.
    // using : current block difficulty, current time, addresses of players.
    // and feed to SHA256 which gives a very big number that we can use to pick
    // a winner.
    
    function random() public view returns(uint256){
        return uint256(keccak256(abi.encodePacked(block.difficulty, now, players))); // is a global fn. 
        // and sha3 are almost same
    }
    
    function pickWinner() public restrictedPicker {
        //Manager should only be able to pick a winner. no one else.
       // require(msg.sender == manager);
        // or another way is to use function modifiers written below so that
        // we dont write this statement over and over in many 
        // different methods.
        uint index = random() % players.length;
        
        // transfer all ether contained inside current contract.
        players[index].transfer(address(this).balance); 
        
        // Need to reset the contract so create new dynamic a
        // with initial size of 0.
        players= new address[](0);
    }
    
    modifier restrictedPicker() {
        require(msg.sender == manager);
        _; // Execute rest of the code from the funtion where invoked and
    }

    function getPlayers() public view returns (address[]) {
        return players;
    }
}