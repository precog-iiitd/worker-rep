pragma solidity ^0.4.18;

import './taskContract.sol';

//created modifer onlyWorker

contract AgreementContract is TaskContract {


	struct agreement {
		
	    uint fee;
		uint taskId;
		uint workerId;
		uint taskPosterId;
		uint creation_time; //optional, no use probably, can remove
		uint taskEnd_time;
		uint reward;
		bool isAccepted;
		bool isTerminated; // to kill or deactivate the agreement, and payout
		//the hash of the solution intially sent by the worker is stored in this variable 
		string solutionHash;
		uint toEvalluateTaskCount;
		bool submittedToEvaluator; 
		string tpSolution;
		mapping (uint => uint)  evaluatorToCompletness;
	    mapping (uint => uint) evaluatorToQuality;
	    mapping(uint => bool) outlier;

	    


	}

	mapping (uint => uint[]) public agreementToEvaluators;

	mapping (uint => bool[]) public agreementToEvaluators_recievedStatus;

	modifier onlyWorker(uint _agreementId){
		//check to only the assigned worker can accept
		require(agreements[_agreementId].workerId == addressToIdWorker[msg.sender]);
		_;
	}

	agreement[] public agreements; //public for testing

	    function getAgreementsCount() public constant returns(uint count) {
    return agreements.length;
}

	function createAgreement(uint _taskId, uint _workerId,uint time_in_hours) external payable {
		
		//-----------------------------CONDITIONS---------------------------------
		 //check if the same task creator is the one that is creating the agreement
		require(tasks[_taskId].TP_creator_id == addressToIdTaskPoster[msg.sender]);
		//check is reward sent is atleast as much as the reward promised
		require( msg.value >= tasks[_taskId].taskReward);
		//----------------------------END of CONDITIONS----------------------------
        uint fee = tasks[_taskId].taskReward/4;
		uint now_time = now;
		uint end_time = now_time + (time_in_hours * 3600);
		uint id = agreements.push(agreement(fee,_taskId,_workerId,addressToIdTaskPoster[msg.sender],now_time,end_time,msg.value,false,false, "",0,false,"")) - 1;

		//no longer available for others// will not show in available tasks
		tasks[_taskId].isTaskAssigned = true; 


		//ADD EVENT For created agreement

	}

function submitToTP(uint _agreementId,string _tpSolution) external onlyWorker(_agreementId){agreements[_agreementId].tpSolution = _tpSolution;}



	function acceptAgreement(uint _agreementId) external payable onlyWorker(_agreementId){
		
		// not finished penalty amount ? could define as a % of reward
		//require( nonFinishPenaltyAMount == msg.value);

		//IF TERMINATED THEN CAN NOT ACCEPT
		require(agreements[_agreementId].isTerminated == false);
		require(msg.value >= agreements[_agreementId].fee);

		//can add consition for single accept

		//adds penalty as a part of the reward
		agreements[_agreementId].fee = msg.value;
		
		agreements[_agreementId].isAccepted = true ;

		//ADD EVENT For accept agreement

	}

	/* function requestEvaluation(uint _agreementId, string _hash) external {

	} 
	*/

	//terminate agreement anytime if not accepted or time limit expires
	function AgreementTerminate(uint _agreementId) external {
		//check creator of agreement;
		require( taskPosters[tasks[agreements[_agreementId].taskId].TP_creator_id].publicAddress == msg.sender );
		require(agreements[_agreementId].isTerminated == false); //not already finished task and given solution
		require( agreements[_agreementId].isAccepted == false || now > agreements[_agreementId].taskEnd_time);//allows terminate if time limit over

		//send back reward
		msg.sender.transfer(agreements[_agreementId].reward); //identity proven in 1st line of this function
		
		//declared terminated
		agreements[_agreementId].isTerminated  = true;

		//ADD EVENT For end agreement
	}

	function _sendRewardAndTerminateAgreement(uint _agreementId) internal { //can test by making it public if required
		//sends reward
		workers[agreements[_agreementId].workerId].publicAddress.transfer(agreements[_agreementId].reward);
		//terminates agreement
		agreements[_agreementId].isTerminated  = true;
	}

	function showAgreement() public view returns(uint[]) {

        uint counter = 0;
        uint i = 0;
        uint noOfAgreement = agreements.length;

        uint[] memory ids_of_agreement = new uint[](noOfAgreement);
        
        if (isTaskPoster[msg.sender]){

        	for(i = 0; i<agreements.length;i++){
            if (agreements[i].taskPosterId == addressToIdTaskPoster[msg.sender]) {
                ids_of_agreement[counter] = i;
                counter++;
                }
            }
        }
        else{
        	for(i = 0; i<agreements.length;i++){
            if (agreements[i].workerId == addressToIdWorker[msg.sender]) {
                ids_of_agreement[counter] = i;
                counter++;
                }
            }
        }
        
            return ids_of_agreement;
        }


	//testing mojo jojo just test
// 	function MOJO_JOJO_t() external {
// 		//adds task 0 and adds an accepted agreement for that tas

// 		uint id = tasks.push(taskStruct("task random name", "gibberish taskHash", false, false, 0, 0)) - 1;
//         tasksCount++;
//         id = agreements.push(agreement(0,0,0,now,now+1000000,0,true,false, "")) - 1;

// 		//no longer available for others// will not show in available tasks
// 		tasks[0].isTaskAssigned = true;


// 	}


}
