pragma solidity ^0.4.2;

import "./crowdSourcing.sol";

contract TaskPoster is User{

     //address owner ; already implemented by Ownable
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



    function TaskPoster(string _userName, int _repScore, bytes _fileHash) user(_userName, _repScore, _fileHash) {
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

  


}