pragma solidity ^0.4.18;

import './agreement.sol';

contract EvaluationContract is AgreementContract {

  uint randNonce = 0;




  function _numberOfEvalutor() private returns (uint){
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

  function getEvaluatorAddresses(uint _agreementId) view onlyWorker(_agreementId) returns(address[]) {


  uint  numberOfEvalutor = 3;
  address[] memory eval_adresses = new address[](numberOfEvalutor);
  
  for(uint8 i=0;i<numberOfEvalutor;i++){
   uint eval_id = agreementToEvaluators[_agreementId][i];
   eval_adresses[i] = workers[eval_id].publicAddress;
  }
  return eval_adresses;
}

function getEvaluatorPublicKeys(uint _agreementId,uint _evalNumber) view onlyWorker(_agreementId) returns(string) {


  uint8 numberOfEvalutor = 3;
 string[] memory eval_adresses = new string[](numberOfEvalutor);
  
  for(uint8 i=0;i<numberOfEvalutor;i++){
   uint eval_id = agreementToEvaluators[_agreementId][i];
   eval_adresses[i] = workers[eval_id].encryptionkeyAddress;
  }
  return eval_adresses[_evalNumber];
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

  mapping (uint => uint[]) public evaluationScoreMapping;
  mapping (uint => uint[]) public agreementToRecievedEvaluatorID;

  function evaluationCompleted(uint _completeness, uint _quality, uint _agreementId) onlyEvaluator(_agreementId){
        agreements[_agreementId].evaluatorToQuality[addressToIdWorker[msg.sender]] = _quality;
        agreements[_agreementId].evaluatorToCompletness[addressToIdWorker[msg.sender]] = _completeness;
//      evaluationScoreMapping[_agreementId].push(evaluationScore) ;
        

        agreementToRecievedEvaluatorID[_agreementId].push(addressToIdWorker[msg.sender]);

      if (agreementToRecievedEvaluatorID[_agreementId].length == agreementToEvaluators[_agreementId].length){
        uint totalRepScore = 0;
        uint meanCompletness;
        uint meanQuality;
        (meanCompletness, meanQuality) = meanCal(_agreementId);
        uint complStandDev ;
        uint qualtStandDev;
        (complStandDev, qualtStandDev) = varianceCal(_agreementId, meanCompletness, meanQuality);
        uint noConsensus;
        noConsensus = consensus(meanCompletness, meanQuality,complStandDev, qualtStandDev , _agreementId);
        uint finalCompletness;
        uint finalQuality;
        (finalCompletness,finalQuality) = finalScore(_agreementId);
        totalRepScore = (finalCompletness + finalQuality)/2 ; 
        uint idWorker = agreements[_agreementId].workerId;
        workers[idWorker].repScore = workers[idWorker].repScore + (totalRepScore);
        // add an event that the worker reputation has been updated
        
      }
      // check if the evaluator is one that has been assigned 

      // check if all evaluators have submitted their evaluation score 

      // if all have send their evalutation compute the reputation score of the the worker for this task 

      //update  reputation of the worker , add function to worker and call that 

  }
  function finalScore(uint agreementId) returns(uint finalCompletness,uint finalQuality){
      uint countFinal =0;
      for (uint m =0 ; m< agreementToRecievedEvaluatorID[agreementId].length ; m++){
          if (agreements[agreementId].outlier[m] == false){
              countFinal++ ;
              finalCompletness += agreements[agreementId].evaluatorToCompletness[agreementToRecievedEvaluatorID[agreementId][m]] * workers[agreementToRecievedEvaluatorID[agreementId][m]].repScore;
              finalQuality += agreements[agreementId].evaluatorToQuality[agreementToRecievedEvaluatorID[agreementId][m]] * workers[agreementToRecievedEvaluatorID[agreementId][m]].repScore; 
          }
        }
        finalQuality = finalQuality/countFinal;
      finalCompletness = finalCompletness/countFinal;
      return (finalCompletness,finalQuality);
  }
  
  function consensus(uint meanCompletness,uint meanQuality,uint complStandDev,uint qualtStandDev ,uint agreementId) returns(uint noNodesConsensus){
      uint count = 0;
      uint returnCount =0;
      for (uint k =0; k< agreementToRecievedEvaluatorID[agreementId].length; k++){
         if (agreements[agreementId].outlier[k] == false){
            uint evalComp = agreements[agreementId].evaluatorToQuality[agreementToRecievedEvaluatorID[agreementId][k]];
             if ((evalComp > (meanCompletness - (5 * complStandDev)/4)) && (evalComp < (meanCompletness + (5 * complStandDev)/4))){
                 count++;
             }
             else {
                 agreements[agreementId].outlier[k] = true;
             }
                    
        }
    }
    if (count>2){
        for (uint l =0; l< agreementToRecievedEvaluatorID[agreementId].length; l++){
         if (agreements[agreementId].outlier[l] == false){
            uint evalqual = agreements[agreementId].evaluatorToQuality[agreementToRecievedEvaluatorID[agreementId][l]];
             if ((evalqual > (meanQuality - (5 * qualtStandDev)/4)) && (evalqual < (meanQuality + (5 * qualtStandDev)/4))){
                 returnCount++;
             }
             else {
                 agreements[agreementId].outlier[k] = true;
             }
                    
        }
    }
        
    }
    return returnCount;
  
  }
  
  function meanCal(uint agreementId) returns (uint meanCompletness, uint meanQuality){
    //   uint meanCompletness ;
    //   uint meanQuality ;
      uint count = 0;
      for (uint k =0; k< agreementToRecievedEvaluatorID[agreementId].length; k++){
         if (agreements[agreementId].outlier[k] == false){
             count++;
         meanQuality += agreements[agreementId].evaluatorToQuality[agreementToRecievedEvaluatorID[agreementId][k]]; 
          meanCompletness += agreements[agreementId].evaluatorToCompletness[agreementToRecievedEvaluatorID[agreementId][k]];
        }
      }
      meanQuality = meanQuality/count;
      meanCompletness = meanCompletness/count;

    return (meanCompletness, meanQuality);
  }
  
  function varianceCal(uint agreementId, uint meanCompletnessVar, uint meanQualityVar) returns (uint compStandDev,uint qualStandDev){
    //   uint meanCompletness ;
    //   uint meanQuality ;
      uint count = 0;
      uint varianceC = 0;
      uint varianceQ = 0;
      for (uint k =0; k< agreementToRecievedEvaluatorID[agreementId].length; k++){
         if (agreements[agreementId].outlier[k] == false){
             count++;
         varianceQ += (meanQualityVar -  agreements[agreementId].evaluatorToQuality[agreementToRecievedEvaluatorID[agreementId][k]]) ** 2 ;
          varianceC += (meanCompletnessVar - agreements[agreementId].evaluatorToCompletness[agreementToRecievedEvaluatorID[agreementId][k]]) **  2;
        }
      }
      varianceQ = varianceQ/count;
      varianceC = varianceC/count;
      compStandDev = sqrt(varianceC); 
      qualStandDev = sqrt(varianceQ) ;

    return (compStandDev, qualStandDev);
  }
  
  function sqrt(uint x) returns (uint y) {
    uint z = (x + 1) / 2;
    y = x;
    while (z < y) {
        y = z;
        z = (x / z + z) / 2;
        }
      
  }


}


