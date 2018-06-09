pragma solidity ^0.4.18;

import './agreement.sol';

contract evaluation is workerTaskPosterContract {



    	uint[][] public workerInRepRange;

	uint randNonce = 0;
	// we can store the number of evaluator and who will be the evaluator before hand (as the task agreement is created but without consuming gas ? some sort of view function )
	function _numberOfEvalutor() returns (uint){
		// depends on difficulty of the task 
		// reputation of the worker 
		// number of worker for that skill 
		return 3;

	}


	function getEvaluatorAddress(uint _agreementId) onlyWorker(_agreementId) returns (address) {
		//check if solution submitted
		require(bytes(agreements[_agreementId].solutionHash).length != 0);

	}

	
	function randomNumberGen(uint _modulus) internal returns(uint) {
    	randNonce++;
    	return uint(keccak256((now+randNonce), msg.sender, randNonce)) % _modulus;
  	}



	function _findingEvaluator(uint _numberOfEvalutor, uint _agreementId) returns(uint[],uint[],uint[]) {
  		
  		uint8 MaxRep = 100;

  		//looping over the worker array 
  		
  		//uint[][] workerInRepRange;
  		
  		
  		//// see how division can be done in such a scenario
  		uint RepInterval = MaxRep / _numberOfEvalutor;
  		//fixed lowerRep = 0 ;
		 
		uint upperRep = RepInterval;




  		for (uint i = 0 ; i< workers.length; i++){
  			// if (worker[i].repScore >= lowerRep && worker[i].repScore < upperRep){
  			// 		workerInRepRange[0].push(addressToIdWorker[worker[i].address])
  			// }
  			// else if (worker[i].repScore >= lowerRep+count && worker[i].repScore < upperRep)
  			uint count = 0 ;
  			while (upperRep<= MaxRep){
  			    
  				if (uint(workers[i].repScore) >= uint256(count*RepInterval)  && uint256(workers[i].repScore) < uint256(upperRep) ){
  					workerInRepRange[count].push(i); //i is id of worker
  					break;
  				}
  				count++;
  				upperRep = ((count+1)*RepInterval);
  				
  				

  			}

  		}
  		return (workerInRepRange[0],workerInRepRange[1],workerInRepRange[2]);
	    
	}
  	// function getEvaluatorIndex(uint randIndex, uint lowerRep, uint upperRep) returns (uint){
  	// 	//loop through all workers check if the reputation score is within the limits , check their skills ,
  	// 	// count the number of such workers that have passsed and stop on the number that equals randIndex

  	// }

////should onlyworker modifier be specified here ?


	function submitHash(string _solutionHash, uint _agreementId) onlyWorker(_agreementId){
		uint numberOfEvalutor = _numberOfEvalutor();
		agreements[_agreementId].solutionHash = _solutionHash;

		_findingEvaluator(numberOfEvalutor, _agreementId);
		
		////shall we just send the id of the worker who is the evaluator for that task or should we send the public key of the evaluator ?

		//division is not floating point how to handle this then ?
		// rather than doing all this just find worker having rep 1 , 2 , 3 , 4 and 5 ? then we need not find even the number of worker
		// 5 people evaluating a task too much of extra load 
		//uint evaluatorIndexCount = 0;
		// send an event to the worker that the evaluator list of the task has been updated
	}
		// number of hash received in the parameters will depend on the number of evaluator for that agreement 


/*
	function sendToEvaluator(uint _agreementId, string submissionHash) onlyWorker(_agreementId){
		//send the hashes to evaluators 
		// function called by worker and a transaction is sent to the evaluators with the hash 
		uint[] evalWorker = agreementToEvaluators[_agreementId];
		for (uint i = 0 ; i < evalWorker.length; i++){
			workers[evalWorker[i]].push(submissionHash);

		}



	}
*/	
	modifier onlyEvaluator(uint _agreementId){
		uint[] evalArray = agreementToEvaluators[_agreementId];
		bool present = false;
		for (uint i = 0; i < evalArray.length; i++){
			if (msg.sender == workers[evalArray[i]].publicAddress){
				present = true;
				break;
			}
		}

		require(present);
		_;
	}

	mapping (uint => uint[]) evaluationScoreMapping;

	function evaluationCompleted(uint evaluationScore, uint _agreementId) onlyEvaluator(_agreementId){

			evaluationScoreMapping[_agreementId].push(evaluationScore) ;

			if (evaluationScoreMapping[_agreementId].length == agreementToEvaluators[_agreementId].length){
				uint totalRepScore = 0;
				for (uint i =0 ; i< evaluationScoreMapping[_agreementId].length ; i++){
					totalRepScore = totalRepScore + evaluationScoreMapping[_agreementId][i];
				}
				uint idWorker = agreements[_agreementId].workerId;
				workers[idWorker].repScore = workers[idWorker].repScore + int(totalRepScore);
				// add an event that the worker reputation has been updated
				
			}
			// check if the evaluator is one that has been assigned 

			// check if all evaluators have submitted their evaluation score 

			// if all have send their evalutation compute the reputation score of the the worker for this task 

			//update  reputation of the worker , add function to worker and call that 

	}


}


