pragma solidity ^0.4.18;

import './taskPoster.sol';

contract workerTaskPosterContract is TaskPosterContract {
	
	struct agreement {
		uint taskId;
		uint workerId;
		uint taskPosterId;
		uint creation_time; //optional, no use probably, can remove
		uint taskEnd_time;
		uint reward;
		bool isAccepted;
		bool isTerminated; // to kill or deactivate the agreement, and payout

	}


	agreement[] public agreements; //public for testing

	function createAgreement(uint _taskId, uint _workerId,uint time_in_hours) external payable {
		
		//-----------------------------CONDITIONS---------------------------------
		 //check if the same task creator is the one that is creating the agreement
		require(tasks[_taskId].TP_creator_id == addressToIdTaskPoster[msg.sender]);
		//check is reward sent is atleast as much as the reward promised
		require( msg.value >= tasks[_taskId].taskReward);
		//----------------------------END of CONDITIONS----------------------------

		uint now_time = now;
		uint end_time = now_time + (time_in_hours * 3600);
		uint id = agreements.push(agreement(_taskId,_workerId,addressToIdTaskPoster[msg.sender],now_time,end_time,msg.value,false,false)) - 1;

		//no longer available for others// will not show in available tasks
		tasks[_taskId].isTaskAssigned = true; 

	}

	function acceptAgreement(uint _agreementId) external payable {
		//check to only the assigned worker can accept
		require(agreements[_agreementId].workerId == addressToIdWorker[msg.sender]);
		// not finished penalty amount ? could define as a % of reward
		//require( nonFinishPenaltyAMount == msg.value);

		//can add consition for single accept

		//adds penalty as a part of the reward
		agreements[_agreementId].reward = agreements[_agreementId].reward + msg.value;
		
		agreements[_agreementId].isAccepted = true ;

	}



	/* function requestEvaluation(uint _agreementId, string _hash) external {

	} 
	*/

	//terminate agreement anytime if not accepted 
	function prematureAgreementTerminate(uint _agreementId) external {
		//check creator of agreement;
		require( taskPosters[tasks[agreements[_agreementId].taskId].TP_creator_id].publicAddress == msg.sender );
		require( agreements[_agreementId].isAccepted == false);

		//send back reward
		msg.sender.transfer(agreements[_agreementId].reward); //identity proven in 1st line of this function
		
		//declared terminated
		agreements[_agreementId].isTerminated  = true;
	}

	function _sendRewardAndTerminateAgreement(uint _agreementId) private { //can test by making it public if required
		//sends reward
		workers[agreements[_agreementId].workerId].publicAddress.transfer(agreements[_agreementId].reward);
		//terminates agreement
		agreements[_agreementId].isTerminated  = true;
	}

}