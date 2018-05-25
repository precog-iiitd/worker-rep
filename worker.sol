pragma solidity ^0.4.2;

import "./crowdSourcing.sol";


contract Worker is User{

    // declares various class variables
    //address owner ; already implemented by Ownable
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


    //constructor to initialize class variables
    function Worker(string _workerSkills, string _userName, int _repScore, bytes _fileHash) user(_userName, _repScore, _fileHash) payable{
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
