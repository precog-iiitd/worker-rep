/* Declare the source file compiler version. */
pragma solidity ^0.4.2;

//provides common oontract ownership functionalities
import "./Ownable.sol";

// common things between worker and user put into base class
contract User is Ownable{
    uint256 joiningFee = 0.000000001 ether;  //potential for intergerence
    string public userName ;
    int repScore ;
    bytes fileHash;

    //constructor to initialize class variables
    function User(string _userName, bytes _fileHash) payable {//payable modifier added to allow contract to recieve ETHER
        
        require(msg.value >= joiningFee); //if fees are less than transaction will be rejected
        userName = _userName ;
        repScore = 0 ; // repScore should be 0 by default //potential for intergerence
        fileHash = _fileHash ; //stores IPFS hash to profile data
        }

}



