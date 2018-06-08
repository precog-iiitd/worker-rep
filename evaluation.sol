pragma solidity ^0.4.18;

import './agreement.sol';

contract evaluation is workerTaskPosterContract {

	uint randNonce = 0;
	// we can store the number of evaluator and who will be the evaluator before hand (as the task agreement is created but without consuming gas ? some sort of view function )
	function _numberOfEvalutor() returns (uint){
		// depends on difficulty of the task 
		// reputation of the worker 
		// number of worker for that skill 
		return 2;

	}


	function getEvaluatorAddress(uint _agreementId) onlyWorker(_agreementId) returns (address) {
		//check if solution submitted
		require(bytes(agreements[_agreementId].solutionHash).length != 0);

	}

	
	function randomNumberGen(uint _modulus) internal returns(uint) {
    	randNonce++;
    	return uint(keccak256((now+randNonce), msg.sender, randNonce)) % _modulus;
  	}

  	// function getEvaluatorIndex(uint randIndex, uint lowerRep, uint upperRep) returns (uint){
  	// 	//loop through all workers check if the reputation score is within the limits , check their skills ,
  	// 	// count the number of such workers that have passsed and stop on the number that equals randIndex

  	// }

////should onlyworker modifier be specified here ?
  	function findingEvaluator(uint _numberOfEvalutor, uint _agreementId) private {
  		//looping over the worker array 
  		
  		uint[][] workerInRepRange;
  		//// see how division can be done in such a scenario
  		uint breakPointRep = 5 / _numberOfEvalutor;
  		//fixed lowerRep = 0 ;
		uint upperRep = breakPointRep;

  		for (uint i = 0 ; i< workers.length; i++){
  			// if (worker[i].repScore >= lowerRep && worker[i].repScore < upperRep){
  			// 		workerInRepRange[0].push(addressToIdWorker[worker[i].address])
  			// }
  			// else if (worker[i].repScore >= lowerRep+count && worker[i].repScore < upperRep)
  			uint count = 0 ;
  			while (upperRep<= 5){
  			    
  				if (uint(workers[i].repScore) >= uint256(count*breakPointRep)  && uint256(workers[i].repScore) < uint256(upperRep) ){
  					workerInRepRange[count].push(addressToIdWorker[(workers[i].publicAddress)]);
  					break;
  				}
  				upperRep = ((count+1)*breakPointRep);
  				count++;
  				

  			}

  		}

  		for (uint j = 0 ; j < _numberOfEvalutor; j++){
			//finding number of worker in range 
			// generating a random number 
			uint randNum = randomNumberGen(workerInRepRange[j].length);
			//uint numberOfWorkerInRepRange = numberOfWorkerInRepRangeFunc(lowerRep,upperRep);
			uint evaluatorIndex = workerInRepRange[j][randNum];
			//uint evaluatorIndex = getEvaluatorIndex(uint randNum, uint lowerRep, uint upperRep);
			// what if one range has very less number of worker
			// find that randNum indexed worker from a list of workers
			agreements[_agreementId].evaluatorId[j] = evaluatorIndex;
			// lowerRep = upperRep;
			// upperRep = upperRep + breakPointRep;

		}
  		

  	}

	function submitHash(string _solutionHash, uint _agreementId) onlyWorker(_agreementId){
		uint numberOfEvalutor = _numberOfEvalutor();
		agreements[_agreementId].solutionHash = _solutionHash;
		findingEvaluator(numberOfEvalutor, _agreementId);
		////shall we just send the id of the worker who is the evaluator for that task or should we send the public key of the evaluator ?

		//division is not floating point how to handle this then ?
		// rather than doing all this just find worker having rep 1 , 2 , 3 , 4 and 5 ? then we need not find even the number of worker
		// 5 people evaluating a task too much of extra load 
		//uint evaluatorIndexCount = 0;
		// send an event to the worker that the evaluator list of the task has been updated
	}
		// number of hash received in the parameters will depend on the number of evaluator for that agreement 
	function sendToEvaluator(uint _agreementId, string submissionHash) onlyWorker(_agreementId){
		//send the hashes to evaluators 
		// function called by worker and a transaction is sent to the evaluators with the hash 
		uint evalWorker = agreements[_agreementId].evaluatorId;
		for (uint i = 0 ; i < evalWorker.length; i++){
			workers[evalWorker[i]].push(submissionHash);

		}



	}
	modifier onlyEvaluator(uint _agreementId){
		uint[] evalArray = agreements[_agreementId].evaluatorId;
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

			if (evaluationScoreMapping[_agreementId].length == agreements[_agreementId].evaluatorId.length){
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


