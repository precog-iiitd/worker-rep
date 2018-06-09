/* Declare the source file compiler version. */
pragma solidity ^0.4.18;

//provides common oontract ownership functionalities
import "./Ownable.sol";

// common things between worker and user put into base class
contract UserContract is Ownable{

    uint256 joiningFee = 0.00000000 ether;  //made 0 for testing convenience
    uint256 public darkBalance = 0 ether; //public for testing
   
    struct User {
    string userName;
    uint repScore;
    string fileHash;
    address publicAddress; //added field to store address
    //string[] evaluations;

}

    //User[] public users;

    User[] public workers;
    User[] public taskPosters;

    uint workersCount = 0; //darkworkers accomodation + prevent Task Poster 2 workers


    mapping (address => bool) public isTaskPoster; //public for testing

    mapping (address => uint256 ) public addressToBalance; //public for testing //keeps one address one person (worker or Tp)

    mapping (address => uint) public addressToIdWorker; //public for testing
    //mapping (uint => uint256) IdToBalanceWorker;

    mapping (address => uint) public addressToIdTaskPoster; //public for testing
    //mapping (uint => uint256) IdToBalanceTaskPoster;

    //constructor to initialize class variables
    function makeWorker(string _userName, string _fileHash) public payable {
        
        require(msg.value >= joiningFee); //if fees are less than transaction will be rejected
        uint id = workers.push(User(_userName, 0, _fileHash,msg.sender)) - 1;
        addressToIdWorker[msg.sender] = id;


        darkBalance = darkBalance + addressToBalance[msg.sender];
        addressToBalance[msg.sender] = msg.value; 

        isTaskPoster[msg.sender] = false;

        //CAN ADD EVENT HERE FOR FRONT END
     }


    function makeTaskPoster(string _userName, string _fileHash) public payable {
        
        require(msg.value >= joiningFee); //if fees are less than transaction will be rejected
        uint id = taskPosters.push(User(_userName, 0, _fileHash,msg.sender)) - 1;
        addressToIdTaskPoster[msg.sender] = id;

        
        darkBalance = darkBalance + addressToBalance[msg.sender];
        addressToBalance[msg.sender] = msg.value; 

        isTaskPoster[msg.sender] = true;

        //CAN ADD EVENT HERE FOR FRONT END
     }

    //allows changing joining fee by owner    
    function setjoiningFee(uint256 _joiningFee) onlyOwner {
        joiningFee = _joiningFee; //MUST BE SPECIFIED IN WEI
    }



function withdrawDarkBalance() external onlyOwner {

    owner.transfer(darkBalance); 
    darkBalance = 0;
  }
    function withdraw() external onlyOwner {

    owner.transfer(this.balance); //can set to withdraw only darkBalance so no ones security is withdrawn
    darkBalance = 0;
  }


  //temp testing function, to be removed after testing
  function makeNWorkers_t(uint _num){
    uint id;
    for(uint i=0;i<_num;i++){

    id = workers.push(User("worker_name", i*8, "gibberish_fileHash",msg.sender)) - 1;
    }
    isTaskPoster[msg.sender] = false;
    addressToIdWorker[msg.sender] = id;
  }

  //temp testing function, to be removed after testing
  function makeNTaskposters_t(uint _num){
    uint id;
    for(uint i=0;i<_num;i++){

    id = taskPosters.push(User("taskposter_name", i*8, "gibberish_fileHash",msg.sender)) - 1;

    }
    isTaskPoster[msg.sender] = true;
    addressToIdTaskPoster[msg.sender] = id;

  }



}



