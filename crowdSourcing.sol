/* Declare the source file compiler version. */
pragma solidity ^0.4.2;

// common things between worker and user put into base class
contract user{
    string public userName ;
    int repScore ;
    bytes fileHash;

    //constructor to initialize class variables
    function user(string _userName, int _repScore, bytes _fileHash) payable{
        userName = _userName ;
        repScore = _repScore ;
        fileHash = _fileHash ;
        }

}

// creating worker contract that inherits user contract
contract worker is user{

    // declares various class variables
    address owner ;
    string workerSkills;
    address[] public receivedContractList;
    address[] public acceptedContractList;
    receivedTaskContractStruct[] public receivedContracts;

    event contractReceived(address ady);

    struct receivedTaskContractStruct{
        address contractAddress ;
        address taskPosterAddress ;
        string taskTitle;
        }


    modifier onlyOwner {
        if (msg.sender != owner ){

          /* build in function in sol that means the transaction wont be executed */
          revert() ;
          }
        else{
    			_;
    		  }
        }

    //constructor to initialize class variables
    function worker(string _workerSkills, string _userName, int _repScore, bytes _fileHash) user(_userName, _repScore, _fileHash) payable{
        owner = msg.sender;
        workerSkills = _workerSkills;
        }

    // called when worker wants to apply for a task
    function taskApply(address _taskPosterAddress,uint taskId) onlyOwner{
        taskPoster poster = taskPoster(_taskPosterAddress);
        poster.registerAddress(taskId);
        }

    // function used to accept task contract
    function taskAccept(address contractAddress ) onlyOwner {
        taskContract contractToAccept = taskContract(contractAddress);
        contractToAccept.workerAccept() ;
        acceptedContractList.push(contractAddress);
        contractToAccept.notifyTaskPoster();
        }

    // self destructs the contract
    function kill() onlyOwner{
        /* pre defined function */
        /* argument is required to send back if there are any ether in the contract when it is killed */
        suicide(owner);
        }

    // used by the task poster to send the task contract to worker upon being selected
    function receiveContract(address contractAddress, string taskTitle) public returns(uint){
        receivedContracts.length++ ;
        receivedContractList.push(contractAddress);
        contractReceived(msg.sender);
        receivedContracts[receivedContracts.length-1].contractAddress = contractAddress;
        receivedContracts[receivedContracts.length-1].taskPosterAddress = msg.sender ;
        receivedContracts[receivedContracts.length-1].taskTitle = taskTitle ;
        return receivedContracts.length;
        }

    //displays the task contracts received by the worker
    function getReceivedTaskContractsDetails(uint index) public constant returns(address, address, string){
        return (receivedContracts[index].contractAddress , receivedContracts[index].taskPosterAddress, receivedContracts[index].taskTitle) ;
        }

    //function submitSolution(bytes solutionHash){
    //
    //}
}

// contract that deals with the functioning of the task poster
contract taskPoster is user{

    address owner;
    taskStruct[] public tasks;
    uint taskContractCount;
  //address[] public taskContractList;
    address[] public acceptedContractsList;
    taskContractStruct[] public contracts;
    registrationStruct[] public registrations;
    address[] public registrationList;

    event addressregistered(address addy);
    event addressAssigned(address Addyy);

    // groups together various information regarding the task contracts created by the task poster
    struct taskContractStruct{
        address contractAddress ;
        address workerAddress ;
        string taskTitle;
        }

    //stores information related to the task registrations received by the task poster
    struct registrationStruct{
        uint taskId ;
        address workerAddress;
        }

    // stores various information of the task
    struct taskStruct{
        uint taskId ;
        string taskTitle ;
        bytes taskHash ;
        string taskSkills;
        string taskStatus;
        uint taskReward ;
        }

    // modifier to let just the owner of the contract perform a particular function
    modifier onlyOwner {
        if (msg.sender != owner ){
        /* build in function in sol that means the transaction wont be executed */
            revert() ;
            }
        else{
      			_;
      		  }

        }

    function taskPoster(string _userName, int _repScore, bytes _fileHash) user(_userName, _repScore, _fileHash) {
        owner = msg.sender;
        }

    // called when task poster wants to post a task
    function taskPost(uint _taskId , string _taskTitle , bytes _taskHash , string _taskSkills , string _taskStatus , uint _taskReward) onlyOwner public returns(uint)  {
        tasks.length++ ;
        tasks[tasks.length-1].taskId = _taskId ;
        tasks[tasks.length-1].taskTitle = _taskTitle;
        tasks[tasks.length-1].taskHash = _taskHash ;
        tasks[tasks.length-1].taskSkills = _taskSkills;
        tasks[tasks.length-1].taskStatus = _taskStatus ;
        tasks[tasks.length-1].taskReward = _taskReward ;
        return tasks.length;
        }

    // get the number of task posted by the worker
    function getTaskCount() public constant returns(uint) {
        return tasks.length;
        }

    // gets the details of the task whose index is index
    function getTask(uint index) public constant returns(uint, string, bytes, string, string, uint) {
        return (tasks[index].taskId, tasks[index].taskTitle, tasks[index].taskHash, tasks[index].taskSkills, tasks[index].taskStatus, tasks[index].taskReward);
        }

    // called by the worker when he wants to register for a task, requires taskId to be specified by the worker
    function registerAddress(uint taskId) {
        registrationList.push(msg.sender);
        registrations.length++;
        registrations[registrations.length-1].taskId = taskId;
        registrations[registrations.length-1].workerAddress = msg.sender ;
        addressregistered(msg.sender);
        }

    // function called by the task poster after the worker is selected by the task poster
    function assignTask(address workerAddress, uint reward, string taskTitle) public returns(uint) {
        // the number of task contracts created by the worker
        contracts.length++;

        // creates an instance for a task contract
        address taskCon = new taskContract(workerAddress, reward) ;
        worker selectedWorker = worker(workerAddress);
        selectedWorker.receiveContract(taskCon,taskTitle);
        contracts[contracts.length-1].contractAddress = taskCon;
        contracts[contracts.length-1].workerAddress = workerAddress ;
        contracts[contracts.length-1].taskTitle = taskTitle ;
        //taskContractList.push(taskCon);
        addressAssigned(workerAddress);
        return contracts.length;
        }

    // fetches the details of the task contracts created by the task poster
    function getAssignedTaskContractsDetails(uint index) public constant returns(address, address, string){
        return (contracts[index].contractAddress , contracts[index].workerAddress, contracts[index].taskTitle) ;
        }

    //return the count of workers hired by the the task poster
    function getAssignedTaskCount() public constant returns(uint){
    //return taskContractList.length ;
        return contracts.length;
        }

    // returns count to registrations received by the task poster in all
    function getRegistrationCount() public constant returns(uint) {
        return registrationList.length;
        }

    // function called by the task contract which is created by the task poster when ever the worker accepts
    function acceptanceNotification(address contractAddress){
        acceptedContractsList.push(contractAddress);
        }

    function kill() onlyOwner{
        /* pre defined function */
        /* argument is required to send back if there are any ether in the contract when it is killed */
        suicide(owner);
        }


}

contract taskContract {
    uint reward;
    address workerAddress ;
    address taskContractOwner;
    bool shouldKill ;
    bool satisfied ;
    uint256 contractCreationTime;

    modifier onlyOwner {
        if (msg.sender != taskContractOwner ){
          /* build in function in sol that means the transaction wont be executed */
          revert() ;
          }

        else{
    			_;
    		  }

        }

    modifier selectedWorker {
        if (msg.sender != workerAddress ){
          /* build in function in sol that means the transaction wont be executed */
          revert() ;
          }
        else{
    			_;
    		  }
        }

    function taskContract(address _workerAddress, uint _reward) payable{
        taskContractOwner = msg.sender ;
        workerAddress = _workerAddress ;
        reward = _reward ;
        shouldKill = true;
        satisfied = false ;
        contractCreationTime = now;
        }

    function kill(uint daysAfter) onlyOwner{
        if (shouldKill && now >= contractCreationTime + daysAfter * 1 days){
            suicide(taskContractOwner);
            }
        else{
            revert();
            }
        }

    function workerAccept () selectedWorker payable {
        shouldKill = false;
        }

  //function workerSubmit selectedWorker(){}

    function evaluate(bool _satisfied){
        if (_satisfied){
            workerAddress.transfer(reward);
            shouldKill = true ;
            }
        }

    function notifyTaskPoster() selectedWorker {
        taskPoster acceptedTaskPoster = taskPoster(taskContractOwner);
        acceptedTaskPoster.acceptanceNotification(this);
        }
}
