pragma solidity ^0.4.2;

import "./crowdSourcing.sol";

contract TaskPosterContract is UserContract {


    // groups together various information regarding the task contracts created by the task poster
    struct taskContractStruct{
        address contractAddress ;
        address workerAddress ;
        string taskTitle;
        }

    
    //stores information related to the task registrations received by the task poster
    /* struct registrationStruct{
        uint taskId ;
        address workerAddress;
        }
 */
    // stores various information of the task
    struct taskStruct{
        //uint taskId ;
        string taskTitle ;
        string taskMaterialsHash ;
        //string taskSkills;
        bool isTaskComplete; //asses requirement of this param
        bool isTaskAssigned;
        uint256 taskReward ; //stored in wei
        address TP_creator;
        address[] registeredAddresses; //people who have applied for this task
        }



     
    taskStruct[] public tasks;
    
    uint public tasksCount;
    
    //mapping (taskposterID => uint[] ) taskposter_to_tasks  //could need

    // called when task poster wants to post a task
    function postTask( string _taskTitle , string _taskHash, uint256 _taskReward) external {
        require(isTaskPoster[msg.sender]);
        taskStruct tempTask;
        tempTask.taskTitle = _taskTitle;
        tempTask.taskMaterialsHash = _taskHash;
        tempTask.taskReward = _taskReward;
        tempTask.isTaskAssigned = false;
        tempTask.isTaskComplete = false;
        
        uint id = tasks.push(tempTask) - 1;
        //uint id = tasks.push(taskStruct(_taskTitle, _taskHash, false, false, _taskReward, msg.sender,[])) - 1;
        tasksCount++;
        
        }


   function showAvailableTasks() public view returns(uint[]) {

        uint counter = 0;
        
        uint[] memory temp_task_struct = new uint[](tasksCount);
        
        for(uint i = 0; i<tasks.length;i++){
            if (tasks[i].isTaskAssigned == false) {
             temp_task_struct[counter] = i;
             counter++;  
                }
            }
            return temp_task_struct;
        }
 


    function markTaskComplete(uint _id) public { //public for testing
        require(isTaskPoster[msg.sender]);  //BEWARE: any task poster can do this
        tasks[_id].isTaskComplete = true;
    }

    function markTaskAssigned(uint _id) public { //public for testing
        require(isTaskPoster[msg.sender]); //BEWARE: any task poster can do this
        tasks[_id].isTaskAssigned = true;
    }

    function registerForTask(uint _taskId) external {
        require(isTaskPoster[msg.sender] == false);
        tasks[_taskId].registeredAddresses.push(msg.sender);
    }

/*     // gets the details of the task whose index is index
    function getTask(uint index) public constant returns(uint, string, bytes, string, string, uint) {
        return (tasks[index].taskId, tasks[index].taskTitle, tasks[index].taskHash, tasks[index].taskSkills, tasks[index].taskStatus, tasks[index].taskReward);
        }

 */
       // Now worker can't register/APPLY for task as per spec1
    /*  
    // called by the worker when he wants to register for a task, requires taskId to be specified by the worker
    function registerAddress(uint taskId) {
        registrationList.push(msg.sender);
        registrations.length++;
        registrations[registrations.length-1].taskId = taskId;
        registrations[registrations.length-1].workerAddress = msg.sender ;
        addressregistered(msg.sender);
        }
 */
    

/*

    // function called by the task poster after the worker is selected by the task poster
    function assignTask(address workerAddress, uint256 reward, string taskTitle) public returns(uint) {
        // the number of task contracts created by the worker
        contracts.length++;

        // creates an instance for a task contract
        address taskCon = new TaskContract(workerAddress, reward) ;

        
        worker selectedWorker = Worker(workerAddress); //Sort of a Dynamic Interface, NOT SURE about this!
        
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

     //not needed as per spec 1   
    // // returns count to registrations received by the task poster in all
    // function getRegistrationCount() public constant returns(uint) {
    //     return registrationList.length;
    //     }

    // function called by the task contract which is created by the task poster when ever the worker accepts
    function acceptanceNotification(address contractAddress){
        acceptedContractsList.push(contractAddress);
        }

  
*/

}