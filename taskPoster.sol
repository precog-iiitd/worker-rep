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
        //require(isTaskPoster[msg.sender]);  //BEWARE: any task poster can do this
        tasks[_id].isTaskComplete = true;
    }

    function markTaskAssigned(uint _id) public { //public for testing
        //require(isTaskPoster[msg.sender] ); //BEWARE: any task poster can do this
        tasks[_id].isTaskAssigned = true;
    }

    function registerForTask(uint _taskId) external {
        require(isTaskPoster[msg.sender] == false);
        tasks[_taskId].registeredAddresses.push(msg.sender);
    }





}