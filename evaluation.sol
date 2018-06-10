pragma solidity ^0.4.18;

import './agreement.sol';

contract evaluation is workerTaskPosterContract {

  uint randNonce = 0;
  function _numberOfEvalutor() returns (uint){
    return 3;
  }


  function getEvaluatorAddress(uint _agreementId) onlyWorker(_agreementId) returns (address) {
    require(bytes(agreements[_agreementId].solutionHash).length != 0);
  }

  
  function randomNumberGen(uint _modulus) internal returns(uint) {
      randNonce++;
      return uint(keccak256((now+randNonce), msg.sender, randNonce)) % _modulus;
    }
    
  function _findingEvaluator(uint _numberOfEvalutor, uint _agreementId) {
      uint MaxRep = 100;
  
      uint RepInterval = MaxRep / _numberOfEvalutor;
      
    uint[][3] workerInRepRange;
      for (uint i = 0 ; i< workers.length; i++){
          uint upperRep = RepInterval;
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
      for(uint j = 0 ; j < _numberOfEvalutor; j++){
          uint randNum = randomNumberGen(workerInRepRange[j].length);
          agreementToEvaluators[_agreementId].push(workerInRepRange[j][randNum]);
      }
      
  }
  
  

  function submitHash(string _solutionHash, uint _agreementId) onlyWorker(_agreementId){
    uint numberOfEvalutor = _numberOfEvalutor();
    agreements[_agreementId].solutionHash = _solutionHash;

    _findingEvaluator(numberOfEvalutor, _agreementId);
    
  }


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
        workers[idWorker].repScore = workers[idWorker].repScore + (totalRepScore);
        // add an event that the worker reputation has been updated
        
      }
      // check if the evaluator is one that has been assigned 

      // check if all evaluators have submitted their evaluation score 

      // if all have send their evalutation compute the reputation score of the the worker for this task 

      //update  reputation of the worker , add function to worker and call that 

  }


}


