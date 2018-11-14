pragma solidity ^0.4.24;
//pragma solidity ^0.4.17;
contract Inbox {
    string public message;
    
    // depricated.
    //function Inbox(string initialMessage) public {
    constructor(string initialMessage) public {
        message = initialMessage;
    }
    
    function setMessage(string newMessage) public {
        message = newMessage;
    }
}