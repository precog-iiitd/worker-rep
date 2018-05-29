pragma solidity ^0.4.18;

import './taskPoster.sol';
contract workerTaskPosterContract is TaskPosterContract {
	
	struct agreement {
		uint taskid;
		uint workerid;
		uint taskPosterid;
		uint creation_time;
		uint reward;
		bool isAccepted;
	}





	function createAgreement() external payable {

	}

	function acceptAgreemtn() external payable {
		
	}

}