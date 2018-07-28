pragma solidity ^0.4.2;

import "./userContract.sol";
contract TaskContract is UserContract {


    // groups together various information regarding the task contracts created by the task poster
    
    // struct taskContractStruct{
    //     address contractAddress ;
    //     address workerAddress ;
    //     string taskTitle;
    //     }

    
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
        uint TP_creator_id;
    }



     
    taskStruct[] public tasks;
    
    uint public tasksCount = 0;
    
    //mapping (taskposterID => uint[] ) taskposter_to_tasks  //could need

        function getTasksCount() public constant returns(uint count) {
    return tasks.length;
}



    // called when task poster wants to post a task
      function postTask( string _taskTitle , string _taskHash, uint256 _taskReward) external {
        require(isTaskPoster[msg.sender] == true);
        uint id = tasks.push(taskStruct(_taskTitle, _taskHash, false, false, _taskReward, addressToIdTaskPoster[msg.sender])) - 1;
        tasksCount++;
        
        }

    mapping (uint => uint[]) public taskIdToRegisteredWorkersId; //people who have applied for this task //public for testing

    function showAvailableTasks() public view returns(uint[]) {

        uint counter = 0;
        uint i = 0;
        
        uint[] memory ids_of_unassignedTasks = new uint[](tasksCount);
        
        
/*         if(isTaskPoster[msg.sender]){
            uint temp = addressToIdTaskPoster[msg.sender];
            for(; i<tasks.length;i++){
            if (tasks[i].TP_creator_id == temp && !tasks[i].isTaskComplete) {
                ids_of_unassignedTasks[counter] = i;
                counter++;
                }
            }
        }

        else            { */
        for(; i<tasks.length;i++){
            if (tasks[i].isTaskAssigned == false) {
                ids_of_unassignedTasks[counter] = i;
                counter++;
                }
            }
                         /* } */
            return ids_of_unassignedTasks;
        }
  


    function markTaskComplete(uint _id) public { //public for testing
        //require(isTaskPoster[msg.sender]);  //BEWARE: any task poster can do this
        tasks[_id].isTaskComplete = true;
    }

    function markTaskAssigned(uint _id) public { //public for testing
        //require(isTaskPoster[msg.sender] ); //BEWARE: any task poster can do this
        tasks[_id].isTaskAssigned = true;
        tasksCount--;
    }



    function registerForTask(uint _taskId) external {
        require(isTaskPoster[msg.sender] == false);
        //tasks[_taskId].registeredWorkersId.push(addressToIdWorker[msg.sender]);
        taskIdToRegisteredWorkersId[_taskId].push(addressToIdWorker[msg.sender]);
    } 

}