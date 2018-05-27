/* Declare the source file compiler version. */
pragma solidity ^0.4.18;

//provides common oontract ownership functionalities
import "./Ownable.sol";

// common things between worker and user put into base class
contract UserContract is Ownable{

    uint256 joiningFee = 0.000000001 ether; 
    uint256 public darkBalance = 0 ether; //public for testing
   
    struct User {
    string userName;
    int repScore;
    string fileHash;
    
                }

    //User[] public users;

    User[] public workers;
    User[] public taskPosters;


    mapping (address => bool) public isTaskPoster; //public for testing

    mapping (address => uint256 ) public addressToBalance; //public for testing

    mapping (address => uint) public addressToIdWorker; //public for testing
    //mapping (uint => uint256) IdToBalanceWorker;

    mapping (address => uint) public addressToIdTaskPoster; //public for testing
    //mapping (uint => uint256) IdToBalanceTaskPoster;

    //constructor to initialize class variables
    function makeWorker(string _userName, string _fileHash) public payable {//payable modifier added to allow contract to recieve ETHER
        
        require(msg.value >= joiningFee); //if fees are less than transaction will be rejected
        uint id = workers.push(User(_userName, 0, _fileHash)) - 1;
        addressToIdWorker[msg.sender] = id;

        darkBalance = darkBalance + addressToBalance[msg.sender];
        addressToBalance[msg.sender] = msg.value; 

        isTaskPoster[msg.sender] = false;
     }


    function makeTaskPoster(string _userName, string _fileHash) public payable {//payable modifier added to allow contract to recieve ETHER
        
        require(msg.value >= joiningFee); //if fees are less than transaction will be rejected
        uint id = taskPosters.push(User(_userName, 0, _fileHash)) - 1;
        addressToIdTaskPoster[msg.sender] = id;

        
        darkBalance = darkBalance + addressToBalance[msg.sender];
        addressToBalance[msg.sender] = msg.value; 

        isTaskPoster[msg.sender] = true;
     }

    //allows changing joining fee by owner    
    function setjoiningFee(uint256 _joiningFee) onlyOwner {
        joiningFee = _joiningFee; //MUST BE SPECIFIED IN WEI
    }


    function withdraw() external onlyOwner {

    owner.transfer(this.balance); //can set to withdraw only darkBalance so no ones security is withdrawn
    darkBalance = 0;
  }
}



