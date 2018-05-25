pragma solidity ^0.4.2;



contract TaskContract {
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

    function TaskContract(address _workerAddress, uint _reward) payable{
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
