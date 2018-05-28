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
